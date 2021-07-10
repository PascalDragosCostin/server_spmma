/* Accesarea bazei de date */

Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
};

let date = new Date();
var userTimezoneOffset = date.getTimezoneOffset() * 60000;
date = new Date(date.getTime() - userTimezoneOffset);


module.exports = function (app, db, databaseLogger) {

    // Temperatura => avg
    try {
        app.get('/db_temperature', (req, res) => {
            let perioada = req.query.period;
            let sql = "";
            let conditon = "";

            switch (perioada) {
                case "Day":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${date.getUTCDate().pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${(date.getUTCDate() + 1).pad(2)}"`;
                    sql = `SELECT time, avg(tmp36) as temperature, strftime('%H', time) as val
                                FROM Weather
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;

                case "Month":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}" 
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 2).pad(2)}"`;
                    sql = `SELECT time, avg(tmp36) as temperature, strftime('%d', time) as valDay 
                                FROM Weather
                                WHERE ${conditon} AND valDay NOT NULL
                                GROUP BY valDay
                                ORDER BY time;`;
                    break;

                case "Year":
                    conditon = `time >= "${date.getFullYear()}" 
                                AND time < "${date.getFullYear() + 1}"`;
                    sql = `SELECT time, avg(tmp36) as temperature, strftime('%m', time) as val
                                FROM Weather 
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;

                case "All":
                    conditon = 'True';
                    sql = `SELECT time, avg(tmp36) as temperature, strftime('%Y%m', time) as val
                                FROM Weather 
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
            }

            databaseLogger.info(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows);
            });
        });
    }
    catch (err) {
        databaseLogger.error(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }


    // Umiditatea => avg
    try {
        app.get('/db_humidity', (req, res) => {
            let perioada = req.query.period;
            let sql = "";
            let conditon = "";

            switch (perioada) {
                case "Day":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${date.getUTCDate().pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${(date.getUTCDate() + 1).pad(2)}"`;
                    sql = `SELECT time, avg(humidity) as humidity, strftime('%H', time) as val
                                FROM Weather
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
                case "Month":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 2).pad(2)}"`;
                    sql = `SELECT time, avg(humidity) as humidity, strftime('%d', time) as valDay 
                                FROM Weather
                                WHERE ${conditon} AND valDay NOT NULL
                                GROUP BY valDay
                                ORDER BY time;`;
                    break;
                case "Year":
                    conditon = `time >= "${date.getFullYear()}"
                                AND time < "${date.getFullYear() + 1}"`;
                    sql = `SELECT time, avg(humidity) as humidity, strftime('%m', time) as val
                                FROM Weather 
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
                case "All":
                    conditon = 'True';
                    sql = `SELECT time, avg(humidity) as humidity, strftime('%Y%m', time) as val
                                FROM Weather 
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
            }

            databaseLogger.info(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows);
            });
        });
    }
    catch (err) {
        databaseLogger.error(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }


    // Gas => max
    try {
        app.get('/db_gas', (req, res) => {
            let perioada = req.query.period;
            let sql = "";
            let conditon = "";

            switch (perioada) {
                case "Day":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${date.getUTCDate().pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${(date.getUTCDate() + 1).pad(2)}"`;
                    sql = `SELECT time, max(ox) as ox, max(nh3) as nh3, max(red) as red, strftime('%H', time) as val
                                FROM Gas
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
                case "Month":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 2).pad(2)}"`;
                    sql = `SELECT time, max(ox) as ox, max(nh3) as nh3, max(red) as red, strftime('%d', time) as valDay 
                                FROM Gas
                                WHERE ${conditon} AND valDay NOT NULL
                                GROUP BY valDay
                                ORDER BY time;`;
                    break;
                case "Year":
                    conditon = `time >= "${date.getFullYear()}"
                                AND time < "${date.getFullYear() + 1}"`;
                    sql = `SELECT time, max(ox) as ox, max(nh3) as nh3, max(red) as red, strftime('%m', time) as val
                                FROM Gas 
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
                case "All":
                    conditon = 'True';
                    sql = `SELECT time, max(ox) as ox, max(nh3) as nh3, max(red) as red, strftime('%Y%m', time) as val
                                FROM Gas 
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
            }

            databaseLogger.info(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows);
            });
        });
    }
    catch (err) {
        databaseLogger.error(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }



    // Light => avg
    try {
        app.get('/db_light', (req, res) => {
            let perioada = req.query.period;
            let sql = "";
            let conditon = "";

            switch (perioada) {
                case "Day":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${date.getUTCDate().pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${(date.getUTCDate() + 1).pad(2)}"`;
                    sql = `SELECT time, avg(light) as light, strftime('%H', time) as val
                                FROM Light
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
                case "Month":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 2).pad(2)}"`;
                    sql = `SELECT time, avg(light) as light, strftime('%d', time) as valDay 
                                FROM Light
                                WHERE ${conditon} AND valDay NOT NULL AND light > 20
                                GROUP BY valDay
                                ORDER BY time;`;
                    break;
                case "Year":
                    conditon = `time >= "${date.getFullYear()}"
                                AND time < "${date.getFullYear() + 1}"`;
                    sql = `SELECT time, avg(light) as light, strftime('%m', time) as val
                                FROM Light 
                                WHERE ${conditon} AND val NOT NULL AND light > 20
                                GROUP BY val
                                ORDER BY time;`;
                    break;
                case "All":
                    conditon = 'True';
                    sql = `SELECT time, avg(light) as light, strftime('%Y%m', time) as val
                            FROM Light 
                            WHERE ${conditon} AND val NOT NULL AND light > 20
                            GROUP BY val
                            ORDER BY time;`;
                    break;
            }

            databaseLogger.info(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows);
            });
        });
    }
    catch (err) {
        databaseLogger.error(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }



    // Sound = Noise => avg
    try {
        app.get('/db_noise', (req, res) => {
            let perioada = req.query.period;
            let sql = "";
            let conditon = "";

            switch (perioada) {
                case "Day":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${date.getUTCDate().pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}-${(date.getUTCDate() + 1).pad(2)}"`;
                    sql = `SELECT time, avg(db) as db, strftime('%H', time) as val
                                FROM Sound
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
                case "Month":
                    conditon = `time >= "${date.getFullYear()}-${(date.getMonth() + 1).pad(2)}"
                                AND time < "${date.getFullYear()}-${(date.getMonth() + 2).pad(2)}"`;
                    sql = `SELECT time, avg(db) as db, strftime('%d', time) as valDay 
                                FROM Sound
                                WHERE ${conditon} AND valDay NOT NULL
                                GROUP BY valDay
                                ORDER BY time;`;
                    break;
                case "Year":
                    conditon = `time >= "${date.getFullYear()}"
                                AND time < "${date.getFullYear() + 1}"`;
                    sql = `SELECT time, avg(db) as db, strftime('%m', time) as val
                                FROM Sound 
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
                case "All":
                    conditon = 'True';
                    sql = `SELECT time, avg(db) as db, strftime('%Y%m', time) as val
                                FROM Sound 
                                WHERE ${conditon} AND val NOT NULL
                                GROUP BY val
                                ORDER BY time;`;
                    break;
            }

            databaseLogger.info(sql);

            db.all(sql, [], (err, rows) => {
                if (err) {
                    databaseLogger.error(err.message);
                    res.status(403).send("Error: SQLite Error");
                }

                res.send(rows);
            });
        });
    }
    catch (err) {
        databaseLogger.error(err.message);
        res.satusCode = 500;
        res.send("Error: Internal Server Error");
    }
};