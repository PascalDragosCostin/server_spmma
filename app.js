const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const fs = require("fs");
const morgan = require('morgan');
const path = require('path')
const rfs = require('rotating-file-stream') 
var nodemailer = require('nodemailer');

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// Date de sesiune, se salveaza la server 
app.use(session({
    secret: "PD",
    cookie: {},
    resave: true,
    saveUninitialized: true
}));


// Sistem de fisiere roll
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


// Logger middleware pentru acces pe server
app.use(morgan(':date[iso] :method, ":url", status=:status, response-time=:response-time ms', {
    stream: accessLogStream
}));


// Logger pentru accesul la baza de date
const SimpleNodeLogger = require('simple-node-logger'),
opts = {
        logDirectory:'./database_logs', 
        fileNamePattern:'<DATE>_db.log',
        dateFormat:'YYYY.MM.DD',
        logFilePath:'database.log',
        timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
    },
databaseLogger = SimpleNodeLogger.createRollingFileLogger( opts );


/* Gestiunea bazei de date SQLite */
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/spmma.db', (err) => {
    if (err) {
        return console.error(err.message);
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




/* Autorizarea vizualizarii datelor */
app.use(function (req, res, next) {
    console.log(req.path);

    // header pe care il au cererile care vin de la RPI
    let pas = req.headers['pass'];
    if (pas == restPassword) {     // undefined == "..." => false
        next();
    }
    else {
        res.locals.session = req.session;
        console.log(req.path);
        if (!req.session.isAuthorized) {
            if (req.path == "/verify-code") {
                if (req.body.code == authorizationCode) {
                    req.session.isAuthorized = true;
                    res.redirect("/")
                }
                else {
                    res.render("authorize", { page_name: 'authorize' })
                }
            }
            else {
                res.render("authorize", { page_name: 'authorize' })
            }
        }
        else {
            next();
        }
    }
});


// rutele de la rest.js, inainte de partea cu autorizarea cu parola
var rest_routes = require('./rest.js')(app, db, databaseLogger, transporter, mailOptions);
var database_routes = require('./database.js')(app, db, databaseLogger);
var gauge_database_routes = require('./gauge_database.js')(app, db, databaseLogger);
var site_routes = require('./site.js')(app);



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