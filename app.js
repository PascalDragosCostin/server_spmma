const express = require('express');  // functii de callback pe cai+metoda
const expressLayouts = require('express-ejs-layouts');  // paginile au acelasi layout
const session = require('express-session');  // variabile de sesiune

const fs = require("fs");  // file system
const morgan = require('morgan');  // middleware pentru log cu accesul pe server
const path = require('path')  // concatenare de cai
const rfs = require('rotating-file-stream')  // fisiere diferite in fiecare zi
const simpleNodeLogger = require('simple-node-logger'); // logger pentru accesul la baza de date
var nodemailer = require('nodemailer');  // client de mail pentru notifcare prin mail

/* Initializarea aplicatiei */
const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


/* Date de sesiune, se salveaza la server */
app.use(session({
    secret: "PascalDragos",
    cookie: {},
    resave: true,
    saveUninitialized: true
}));


/* Sistem de fisiere roll */
const pad = num => (num > 9 ? "" : "0") + num;
const generator = () => {
  let time = new Date();
  let year = time.getFullYear();
  let month =  pad(time.getMonth() + 1);
  var day = pad(time.getDate());

  return `${year}-${month}-${day}_acces.log`;
};

const accessLogStream = rfs.createStream(generator, {
    interval: '1d', // rotire zilnica
    path: path.join(__dirname, 'acces_logs')
})


/* Logger middleware pentru acces pe server cu rotating file system */
app.use(morgan(':date[iso] :method, ":url", status=:status, response-time=:response-time ms', {
    stream: accessLogStream
}));


/* Logger pentru accesul la baza de date */
const opts = {
        logDirectory:'./database_logs', 
        fileNamePattern:'<DATE>_db.log',
        dateFormat:'YYYY-MM-DD',
        logFilePath:'database.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    };
const databaseLogger = simpleNodeLogger.createRollingFileLogger( opts );


/* Gestiunea bazei de date SQLite */
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/spmma.db', (err) => {
    if (err) {
        return databaseLogger.error(err.message);
    }
    databaseLogger.info('Connected to database.');
});


/* Citirea fisierului de configurari */
var cfg = JSON.parse(fs.readFileSync("cfg.json"));
const port = cfg.port;
const authorizationCode = cfg.userPassword;
const restPassword = cfg.restPassword


/* Clientul de mail */
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'alert.spmma@gmail.com',
      pass: 'JBXn3E2Z'
    }
  });
  
var mailOptions = {
    from: 'alert.spmma@gmail.com',
    to: `${cfg.userMail}`,
    subject: 'Mail de la SPMMA',
    text: 'Verifica aplicatia!'
};


/* Autorizarea accesului pe server cu parola sau cu valoare din session */
app.use(function (req, res, next) {
    console.log(req.path);

    // Verifica daca e cerere de la RPI cu parola
    let pas = req.headers['pass'];
    if (pas == restPassword) {     // undefined == "..." => false
        next();
    }
    // Verifica daca e cerere din browser de la o sesiune autentificata
    else {
        res.locals.session = req.session;
        if (!req.session.isAuthorized) {
            if (req.path == "/verify-code") {
                if (req.body.code == authorizationCode) {
                    req.session.isAuthorized = true;
                    res.redirect("/")
                }
                else {
                    res.render("authorize", { pageName: 'authorize' })
                }
            }
            else {
                res.render("authorize", { pageName: 'authorize' })
            }
        }
        else {
            next();
        }
    }
});


/* rutele pentru rest, site-ul web si accesul asincron la baza de date*/
var restRoutes = require('./rest.js')(app, db, databaseLogger, transporter, mailOptions);
var siteRoutes = require('./site.js')(app);
var databaseRoutes = require('./database.js')(app, db, databaseLogger);
var gaugeDatabaseRoutes = require('./gauge_database.js')(app, db, databaseLogger);


/* Accesearea unui link gresit te duce pe default */
app.use((req, res, next) => {
    res.redirect("/");
});


/* Pornirea serverului */
app.listen(port, () => console.log(`Serverul rulează la adresa http://localhost:${port}`));


/* Inchiderea serverului */
process.on('SIGINT', function () {
    console.log("Server stops...");
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
    });

    app.close();
});