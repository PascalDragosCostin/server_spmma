const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const fs = require("fs");

const app = express();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(session({
    secret: "PD",
    cookie: {},
    resave: true,
    saveUninitialized: true
}));


/* Gestiunea bazei de date SQLite */
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/spmma.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to database.');
});

// rutele de la rest.js, inainte de partea cu autorizarea cu parola
var rest_routes = require('./rest.js')(app, db);
var database_routes = require('./database.js')(app, db);
var gauge_database_routes = require('./gauge_database.js')(app, db);
var site_routes = require('./site.js')(app);


/* Citirea fisierului de configurari */
var cfg = JSON.parse(fs.readFileSync("cfg.json"));
const port = cfg.port;
const authorizationCode = cfg.authorizationCode;


// /* Autorizarea vizualizarii datelor */
// app.use(function (req, res, next) {
//     res.locals.session = req.session;
//     console.log(req.path);
//     if (!session.isAuthorized) {
//         if (req.path == "/verify-code") {
//             if (req.body.code == authorizationCode) {
//                 session.isAuthorized = true;
//                 res.redirect("/")
//             }
//             else {
//                 res.render("authorize", {})
//             }
//         }
//         else {
//             res.render("authorize", {})
//         }
//     }
//     else {
//         next();
//     }
// });



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