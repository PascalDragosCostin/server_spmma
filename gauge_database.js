let date = new Date();
var userTimezoneOffset = date.getTimezoneOffset() * 60000;
date = new Date(date.getTime() - userTimezoneOffset);
var condition = `time <= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${(date.getUTCDate()+1).pad(2)}"`


module.exports = function (app, db) {
    // Temperatura, umiditate, ITU
    try {
        app.get('/db_gauge_weather', (req, res) => {
            let sql = `SELECT tmp36 as temperature, humidity
            FROM Weather
            WHERE ${condition}
            ORDER BY time
            DESC LIMIT 1;`;
            console.log(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows[0]); // oricum e doar un row

            });
        });
    }
    catch (err) {
        console.log(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }


    // Light
    try {
        app.get('/db_gauge_noise', (req, res) => {
            let sql = `SELECT db as noise
                    FROM Sound
                    WHERE ${condition}
                    ORDER BY time
                    DESC LIMIT 1;`;
            console.log(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows[0]); // oricum e doar un row

            });
        });
    }
    catch (err) {
        console.log(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }


    // Gas
    try {
        app.get('/db_gauge_gas', (req, res) => {
            let sql = `SELECT ox, red, nh3
                    FROM Gas
                    WHERE ${condition}
                    ORDER BY time
                    DESC LIMIT 1;`;
            console.log(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows[0]); // oricum e doar un row

            });
        });
    }
    catch (err) {
        console.log(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }


    // Light
    try {
        app.get('/db_gauge_light', (req, res) => {
            let sql = `SELECT light
            FROM Light
            WHERE ${condition}
            ORDER BY time
            DESC LIMIT 1;`;
            console.log(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.log(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows[0]); // oricum e doar un row

            });
        });
    }
    catch (err) {
        console.log(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }

};