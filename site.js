module.exports = function (app) {

    /* Gestionarea cererilor din browser */
    app.get('/', (req, res) => {
        res.redirect("/about");
    }
    );

    // Informatii generale despre aplicatie
    app.get('/about', (req, res) => {
        res.render('about.ejs', {});
    }
    );

    // Temperatura
    app.get('/comfort', (req, res) => {
        res.render('comfort.ejs', {});
    }
    );

    // Temperatura
    app.get('/temperature', (req, res) => {
        res.render('temperature.ejs', {});
    }
    );

    // Umiditate
    app.get('/humidity', (req, res) => {
        res.render('humidity.ejs', {});
    }
    );

    // OX, RED, NH3
    app.get('/gas', (req, res) => {
        res.render('gas.ejs', {});
    }
    );

    // Lumina
    app.get('/light', (req, res) => {
        res.render('light.ejs', {});
    }
    );

    // Zgomot
    app.get('/noise', (req, res) => {
        res.render('noise.ejs', {});
    }
    );

};