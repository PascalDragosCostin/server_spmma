/* Actualizarea datelor de pe server. Eventual cu parola de la server */

module.exports = function (app, db) {
    /*
    {
        "date": "2021-04-01 10:20:05.123",
        "temperature": 26.7,
        "humidity": 45.5,
        "pressure": 120,
        "tmp36": 24.5
    }
    */
    app.post('/weather', (req, res) => {
        try {
            // Evit SQL Injection
            let cmd = `INSERT INTO WEATHER  VALUES(?, ?, ?, ?, ?);`;
            let args = [req.body.date, req.body.temperature, req.body.humidity, req.body.pressure, req.body.tmp36];
            console.log(args);
            db.run(cmd, args, function (err) {
                if (err) {
                    console.log(err.message);
                    res.status(403).send("Error: SQLite Error");
                }
                else {
                    res.statusCode = 201;
                    res.send("Created");
                }
            });
        }
        catch (err) {
            console.log(err.message);
            res.satusCode = 500;
            res.send("Error: Internal Server Error");
        }
    });


    app.post('/light', (req, res) => {
        try {
            // Evit SQL Injection
            let cmd = `INSERT INTO LIGHT VALUES(?, ?, ?);`;
            let args = [req.body.date, req.body.light, req.body.proximity];
            console.log(args);
            db.run(cmd, args, function (err) {
                if (err) {
                    console.log(err.message);
                    res.status(403).send("Error: SQLite Error");
                }
                else {
                    res.statusCode = 201;
                    res.send("Created");
                }
            });
        }
        catch (err) {
            console.log(err.message);
            res.satusCode = 500;
            res.send("Error: Internal Server Error");
        }
    });


    app.post('/sound', (req, res) => {
        console.log(req.body);
    });


    app.post('/gas', (req, res) => {
        try {
            // Evit SQL Injection
            let cmd = `INSERT INTO GAS VALUES(?, ?, ?, ?);`;
            let args = [req.body.date, req.body.ox, req.body.red, req.body.nh3];
            console.log(args);
            db.run(cmd, args, function (err) {
                if (err) {
                    console.log(err.message);
                    res.status(403).send("Error: SQLite Error");
                }
                else {
                    res.statusCode = 201;
                    res.send("Created");
                }
            });
        }
        catch (err) {
            console.log(err.message);
            res.satusCode = 500;
            res.send("Error: Internal Server Error");
        }
    });


    app.put('/error', (req, res) => {
        try {
            // Evit SQL Injection
            let cmd = `INSERT INTO ERROR VALUES(?, ?);`;
            let args = [req.body.date, req.body.id];
            console.log(args);
            db.run(cmd, args, function (err) {
                if (err) {
                    console.log(err.message);
                    res.status(403).send("Error: SQLite Error");
                }
                else {
                    res.statusCode = 201;
                    res.send("Created");
                }
            });
        }
        catch (err) {
            console.log(err.message);
            res.satusCode = 500;
            res.send("Error: Internal Server Error");
        }
    });


    app.delete('/all', (req, res) => {

    });
};