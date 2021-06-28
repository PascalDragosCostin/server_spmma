module.exports = function (app) {

    /* Gestionarea cererilor din browser */
    app.get('/', (req, res) => {
        res.redirect("/about");
    }
    );

    // Informatii generale despre aplicatie
    app.get('/about', (req, res) => {
        res.render('about.ejs', {page_name: 'about'});
    }
    );

    // Temperatura
    app.get('/comfort', (req, res) => {
        res.render('comfort.ejs', {page_name: 'comfort'});
    }
    );

    // Temperatura
    app.get('/temperature', (req, res) => {
        res.render('temperature.ejs', {page_name: 'temperature'});
    }
    );

    // Umiditate
    app.get('/humidity', (req, res) => {
        res.render('humidity.ejs', {page_name: 'humidity'});
    }
    );

    // OX, RED, NH3
    app.get('/gas', (req, res) => {
        res.render('gas.ejs', {page_name: 'gas'});
    }
    );

    // Lumina
    app.get('/light', (req, res) => {
        res.render('light.ejs', {page_name: 'light'});
    }
    );

    // Zgomot
    app.get('/noise', (req, res) => {
        res.render('noise.ejs', {page_name: 'noise'});
    }
    );

    app.get('/verify-code', (req, res) => {
        res.render('authorize.ejs', {page_name: 'authorize'});
    }
    );

};