/* Actualizarea datelor de pe server */

/* Limitele pentru notificare prin mail */
const TEMPERATURE_MIN = 17
const TEMPERATURE_MAX = 27
const HUMIDITY_MIN = 18
const HUMIDITY_MAX = 70
const OX_MAX = 100_000
const RED_MAX = 100_000
const NH3_MAX = 100_000


module.exports = function (app, db, databaseLogger, transporter, mailOptions) {
    /*
    body = 
    {
        "date": "2021-04-01 10:20:05.123",
        "temperature": 26.7,
        "humidity": 45.5,
        "pressure": 1009,
        "tmp36": 24.5
    }
    */
    app.post('/weather', (req, res) => {
        try {
            let temp = req.body.tmp36;
            let hum = req.body.humidity;
            let date = req.body.date;

            // Notificare prin mail
            let message = date + "\n";
            let subject = "Alerta"
            let flagMail = false;
            if(temp < TEMPERATURE_MIN || temp > TEMPERATURE_MAX)
            {
                flagMail = true;
                subject += " temperatura"
                message += `Temperatura este în afara intervalului stabilit:\nTemperatura este ${temp} °C.\n`
            }
            if(hum < HUMIDITY_MIN || hum > HUMIDITY_MAX)
            {
                subject += " umiditate"
                flagMail = true;
                message += `Umiditatea este în afara intervalului stabilit:\nUmiditatea este ${hum} %.\n`
            }

            if(flagMail)
            {
                mailOptions["subject"] = subject;
                mailOptions["text"] = message;
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        databaseLogger.error(error);
                    }
                  });
            }

            // Evit SQL Injection
            let cmd = `INSERT INTO WEATHER  VALUES(?, ?, ?, ?, ?);`;
            let args = [date, req.body.temperature, hum, req.body.pressure, temp];
            databaseLogger.info(cmd + " " + args);
            db.run(cmd, args, function (err) {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }
                else {
                    res.statusCode = 201;
                    res.send("Created");
                }
            });
        }
        catch (err) {
            databaseLogger.error(err.message);
            res.satusCode = 500;
            res.send("Error: Internal Server Error");
        }
    });


    app.post('/light', (req, res) => {
        try {
            // Evit SQL Injection
            let cmd = `INSERT INTO LIGHT VALUES(?, ?, ?);`;
            let args = [req.body.date, req.body.light, req.body.proximity];
            databaseLogger.info(cmd + " " + args);
            db.run(cmd, args, function (err) {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }
                else {
                    res.statusCode = 201;
                    res.send("Created");
                }
            });
        }
        catch (err) {
            databaseLogger.error(err.message);
            res.satusCode = 500;
            res.send("Error: Internal Server Error");
        }
    });


    app.post('/sound', (req, res) => {
        try {
            // Evit SQL Injection
            let cmd = `INSERT INTO sound VALUES(?, ?, ?);`;
            let args = [req.body.date, req.body.db, req.body.freq];
            databaseLogger.info(cmd + " " + args);
            db.run(cmd, args, function (err) {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }
                else {
                    res.statusCode = 201;
                    res.send("Created");
                }
            });
        }
        catch (err) {
            databaseLogger.error(err.message);
            res.satusCode = 500;
            res.send("Error: Internal Server Error");
        }
    });


    app.post('/gas', (req, res) => {
        try {
            let date = req.body.date;
            let ox = req.body.ox;
            let red = req.body.red;
            let nh3 = req.body.nh3;

            let message = date + "\n";
            let subject = "Alerta gaz"
            let flagMail = false;
            if(ox > OX_MAX)
            {
                flagMail = true;
                message += `Valoarea pentru gazele oxidante este în afara intervalului stabilit:\nValoarea este ${ox}.\n`
            }
            if(red > RED_MAX)
            {
                flagMail = true;
                message += `Valoarea pentru gazele reducatoare este în afara intervalului stabilit:\nValoarea este ${red}.\n`
            }
            if(nh3 > NH3_MAX)
            {
                flagMail = true;
                message += `Valoarea pentru gazele din categoria amoniacului este în afara intervalului stabilit:\nValoarea este ${nh3}.\n`
            }

            if(flagMail)
            {
                mailOptions["subject"] = subject;
                mailOptions["text"] = message;
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        databaseLogger.error(error);
                    }
                  });
            }

            // Evit SQL Injection
            let cmd = `INSERT INTO GAS VALUES(?, ?, ?, ?);`;
            let args = [date, ox, red, nh3];
            databaseLogger.info(cmd + " " + args);
            db.run(cmd, args, function (err) {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }
                else {
                    res.statusCode = 201;
                    res.send("Created");
                }
            });
        }
        catch (err) {
            databaseLogger.error(err.message);
            res.satusCode = 500;
            res.send("Error: Internal Server Error");
        }
    });
    
};