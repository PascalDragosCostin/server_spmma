/* Gestionarea cererilor din browser */

module.exports = function (app) {
    
    app.get('/', (req, res) => {
        res.redirect("/comfort");
    }
    );

    // Informatii generale despre aplicatie
    app.get('/about', (req, res) => {
        res.render('about.ejs', {pageName: 'about'});
    }
    );

    // Informatii despre valoare actuala a marimilor masurate
    app.get('/comfort', (req, res) => {
        res.render('comfort.ejs', {pageName: 'comfort'});
    }
    );

    // Temperatura
    app.get('/temperature', (req, res) => {
        res.render('temperature.ejs', {pageName: 'temperature'});
    }
    );

    // Umiditate
    app.get('/humidity', (req, res) => {
        res.render('humidity.ejs', {pageName: 'humidity'});
    }
    );

    // OX, RED, NH3
    app.get('/gas', (req, res) => {
        res.render('gas.ejs', {pageName: 'gas'});
    }
    );

    // Lumina
    app.get('/light', (req, res) => {
        res.render('light.ejs', {pageName: 'light'});
    }
    );

    // Zgomot
    app.get('/noise', (req, res) => {
        res.render('noise.ejs', {pageName: 'noise'});
    }
    );

    // Pagina de autentificare
    app.get('/verify-code', (req, res) => {
        res.render('authorize.ejs', {pageName: 'authorize'});
    }
    );

};