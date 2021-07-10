/*  Temperature Gauge */
var t_opts = {
    angle: -0.2, // The span of the gauge arc
    lineWidth: 0.2, // The line thickness
    radiusScale: 1, // Relative radius

    pointer: {
        length: 0.5, // // Relative to gauge radius
        strokeWidth: 0.045, // The thickness
        color: '#00000 ', // Fill color
        strokeColor: '#E0E0E0'
    },
    limitMax: true,     // If false, max value increases automatically if value > maxValue
    limitMin: true,      // If true, the min value of the gauge will be fixed
    highDpiSupport: true,     // High resolution support
    fractionDigits: 1,
    staticLabels: {
        font: "10px sans-serif",  // Specifies font
        labels: [15, 17, 19, 20, 24, 25, 27, 30],  // Print labels at these values
        color: "#e4ffff",  // Optional: Label text color
        fractionDigits: 0  // Optional: Numerical precision. 0=round off.
    },
    staticZones: [
        { strokeStyle: "#F91700", min: 15, max: 17 },
        { strokeStyle: "#E99000", min: 17, max: 19 },
        { strokeStyle: "#C6E900", min: 19, max: 20 },

        { strokeStyle: "#05E900", min: 20, max: 24 },

        { strokeStyle: "#C6E900", min: 24, max: 25 },
        { strokeStyle: "#E99000", min: 25, max: 27 },
        { strokeStyle: "#F91700", min: 27, max: 30 }
    ],
};

var t_target = document.getElementById('t_gauge');
var t_gauge = new Gauge(t_target).setOptions(t_opts);
t_gauge.setMinValue(15);
t_gauge.maxValue = 30;

var t_textRenderer = new TextRenderer(document.getElementById("t_preview-textfield"));
t_textRenderer.render = function (gauge) {
    this.el.innerHTML = "Temperatură: " + (gauge.displayedValue).toFixed(1) + "°C";
};
t_gauge.setTextField(t_textRenderer);


/* Humidity gauge */
var h_opts = {
    angle: -0.2,
    lineWidth: 0.2,
    radiusScale: 1,
    pointer: {
        length: 0.5,
        strokeWidth: 0.035,
        color: '#000000'
    },
    limitMax: true,
    limitMin: true,
    highDpiSupport: true,
    staticLabels: {
        font: "10px sans-serif",
        labels: [0, 10, 20, 30, 60, 75, 80, 100],
        color: "#e4ffff",
        fractionDigits: 0
    },
    staticZones: [
        { strokeStyle: "#cc0033", min: 0, max: 10 },
        { strokeStyle: "#970065", min: 10, max: 20 },
        { strokeStyle: "#660099", min: 20, max: 30 },

        { strokeStyle: "#0EDBF5", min: 30, max: 60 },

        { strokeStyle: "#660099", min: 60, max: 75 },
        { strokeStyle: "#970065", min: 75, max: 80 },
        { strokeStyle: "#cc0033", min: 80, max: 100 }
    ],
};

var h_target = document.getElementById('h_gauge');
var h_gauge = new Gauge(h_target).setOptions(h_opts);
h_gauge.setMinValue(0);
h_gauge.maxValue = 100;

document.getElementById("h_preview-textfield").className = "h_preview-textfield";
h_gauge.setTextField(document.getElementById("h_preview-textfield"));


/* Termal Comford Index gauge */
function get_itu(t, u) {
    return (t * 1.8 + 32) - (0.55 - 0.0055 * u) * ((t * 1.8 + 32) - 58);
}

var tci_opts = {
    angle: -0.2,
    lineWidth: 0.2,
    radiusScale: 1,
    pointer: {
        length: 0.5,
        strokeWidth: 0.035,
        color: '#000000'
    },
    limitMax: true,
    limitMin: true,
    highDpiSupport: true,
    staticLabels: {
        font: "10px sans-serif",
        labels: [0, 55, 65, 80, 100],
        color: "#e4ffff",
        fractionDigits: 0
    },
    staticZones: [
        { strokeStyle: "#1aff1a", min: 0, max: 55 },
        { strokeStyle: "#99ff33", min: 55, max: 65 },
        { strokeStyle: "#ffcc00", min: 65, max: 80 },
        { strokeStyle: "#ff3300", min: 80, max: 100 },

    ],
};

var tci_target = document.getElementById('tci_gauge');
var tci_gauge = new Gauge(tci_target).setOptions(tci_opts);
tci_gauge.setMinValue(0);
tci_gauge.maxValue = 100;

document.getElementById("tci_preview-textfield").className = "tci_preview-textfield";
tci_gauge.setTextField(document.getElementById("tci_preview-textfield"));


/* Actualizare t, h, TCI */
function getLastWeather() {

    var xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText);
            let temperature = json["temperature"];
            let humidity = json["humidity"];

            t_gauge.set(temperature);
            h_gauge.set(humidity);
            let itu = get_itu(temperature, humidity);
            tci_gauge.set(itu);

        }
    };

    xhttp.open("GET", "/db_gauge_weather", true);
    xhttp.send();
}
getLastWeather();


/* Noise Gauge */
var n_opts = {
    angle: -0.2,
    lineWidth: 0.2,
    radiusScale: 1,
    pointer: {
        length: 0.5,
        strokeWidth: 0.035,
        color: '#000000'
    },
    limitMax: true,
    limitMin: true,
    highDpiSupport: true,
    staticLabels: {
        font: "10px sans-serif",
        labels: [0, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120],
        color: "#e4ffff",
        fractionDigits: 0
    },
    staticZones: [
        { strokeStyle: "#009DF9", min: 0, max: 20 },
        { strokeStyle: "#00F9CA ", min: 20, max: 30 },
        { strokeStyle: "#00F93F", min: 30, max: 40 },
        { strokeStyle: "#00FF12", min: 40, max: 50 },
        { strokeStyle: "#AFFF00", min: 50, max: 60 },
        { strokeStyle: "#E7F900", min: 60, max: 70 },
        { strokeStyle: "#FFD800", min: 70, max: 80 },
        { strokeStyle: "#F94F00", min: 80, max: 90 },
        { strokeStyle: "#FF2300", min: 90, max: 100 },
        { strokeStyle: "#FF0000", min: 100, max: 120 },
    ],
};

var n_target = document.getElementById('n_gauge');
var n_gauge = new Gauge(n_target).setOptions(n_opts);
n_gauge.setMinValue(0);
n_gauge.maxValue = 120;

document.getElementById("n_preview-textfield").className = "n_preview-textfield";
n_gauge.setTextField(document.getElementById("n_preview-textfield"));


/* Actualizare zgomot */
function getLastNoise() {

    var xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText);
            let noise = json["noise"];

            n_gauge.set(noise);
        }
    };

    xhttp.open("GET", "/db_gauge_noise", true);
    xhttp.send();
}
getLastNoise();



/* Gases Gauge */
/* OX */ 
var g_opts = {
    angle: -0.2,
    lineWidth: 0.2,
    radiusScale: 1,
    pointer: {
        length: 0.5,
        strokeWidth: 0.035,
        color: '#000000'
    },
    limitMax: true,
    limitMin: true,
    highDpiSupport: true,
    staticLabels: {
        font: "10px sans-serif",
        labels: [],
        color: "#e4ffff",
        fractionDigits: 0
    },
    staticZones: [
        { strokeStyle: "#18F749", min: 0, max: 10_000 },
        { strokeStyle: "#23F718", min: 10_000, max: 15_000 },
        { strokeStyle: "#60F718", min: 15_000, max: 16_500 },

        { strokeStyle: "#B8F718", min: 16_500, max: 20_500 },

        { strokeStyle: "#E1EE19", min: 20_500, max: 25_500 },
        { strokeStyle: "#F75818", min: 25_000, max: 30_000 },
        { strokeStyle: "#FC0800", min: 30_000, max: 40_000 },
    ],
};

var g_target = document.getElementById('g_gauge');
var g_gauge = new Gauge(g_target).setOptions(g_opts);
g_gauge.setMinValue(0);
g_gauge.maxValue = 40_000;

// cu cat creste rezistenta, cu atat e mai mare concentratie de NO2
var g_textRenderer = new TextRenderer(document.getElementById("g_preview-textfield"));
g_textRenderer.render = function (gauge) {
    let percent = (gauge.displayedValue - gauge.minValue)/ (gauge.maxValue - gauge.minValue) - 0.5;
    let sign = ""
    if (percent > 0)
    {
        sign = "+"
    }
    this.el.innerHTML =  "NO<sub>2</sub> (Ox): " + sign + (percent*100).toFixed(1) + "%" ;
};
g_gauge.setTextField(g_textRenderer);


/* RED */
var g2_opts = {
    angle: -0.2,
    lineWidth: 0.2,
    radiusScale: 1,
    pointer: {
        length: 0.5,
        strokeWidth: 0.035,
        color: '#000000'
    },
    limitMax: true,
    limitMin: true,
    highDpiSupport: true,
    staticLabels: {
        font: "10px sans-serif",
        labels: [],
        color: "#e4ffff",
        fractionDigits: 0
    },
    staticZones: [
        { strokeStyle: "#18F749", min: 600, max: 700 },
        { strokeStyle: "#23F718", min: 500, max: 600 },
        { strokeStyle: "#60F718", min: 300, max: 500 },

        { strokeStyle: "#B8F718", min: 200, max: 300 },

        { strokeStyle: "#E1EE19", min: 180, max: 200 },
        { strokeStyle: "#F75818", min: 100, max: 180 },
        { strokeStyle: "#FC0800", min: 000, max: 100 },
    ],
};

var g2_target = document.getElementById('g2_gauge');
var g2_gauge = new Gauge(g2_target).setOptions(g2_opts);
g2_gauge.setMinValue(0);
g2_gauge.maxValue = 700;

// cu cat creste rezistenta, cu atat e mai mica concentratia
var g2_textRenderer = new TextRenderer(document.getElementById("g2_preview-textfield"));
g2_textRenderer.render = function (gauge) {
    let percent = (gauge.displayedValue - gauge.minValue)/ (gauge.maxValue - gauge.minValue) - 0.5;
    percent = -percent;
    let sign = ""
    if (percent > 0)
    {
        sign = "+"
    }
    this.el.innerHTML =  "CO (RED): " + sign + (percent*2*100).toFixed(1) + "%" ;
};
g2_gauge.setTextField(g2_textRenderer);


/* NH3 */
var g3_opts = {
    angle: -0.2,
    lineWidth: 0.2,
    radiusScale: 1,
    pointer: {
        length: 0.5,
        strokeWidth: 0.035,
        color: '#000000'
    },
    limitMax: true,
    limitMin: true,
    highDpiSupport: true,
    staticLabels: {
        font: "10px sans-serif",
        labels: [],
        color: "#e4ffff",
        fractionDigits: 0
    },
    staticZones: [
        { strokeStyle: "#18F749", min: 140, max: 150 },
        { strokeStyle: "#23F718", min: 120, max: 140 },
        { strokeStyle: "#60F718", min: 95, max: 120 },

        { strokeStyle: "#B8F718", min: 75, max: 95 },

        { strokeStyle: "#E1EE19", min: 65, max: 75 },
        { strokeStyle: "#F75818", min: 50, max: 65 },
        { strokeStyle: "#FC0800", min: 40, max: 50 },
    ],
};

var g3_target = document.getElementById('g3_gauge');
var g3_gauge = new Gauge(g3_target).setOptions(g3_opts);
g3_gauge.setMinValue(40);
g3_gauge.maxValue = 150;

// cu cat creste rezistenta, cu atat e mai mica concentratia
var g3_textRenderer = new TextRenderer(document.getElementById("g3_preview-textfield"));
g3_textRenderer.render = function (gauge) {
    let percent = (gauge.displayedValue - gauge.minValue)/ (gauge.maxValue - gauge.minValue) - 0.5;
    percent = -percent;
    let sign = ""
    if (percent > 0)
    {
        sign = "+"
    }
    this.el.innerHTML =  "NH<sub>3</sub>: " + sign + (percent*2*100).toFixed(1) + "%" ;
};
g3_gauge.setTextField(g3_textRenderer);


/* Actualizare gaz */
function getLastGas() {

    var xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText);
            let ox = json["ox"];
            let red = json["red"];
            let nh3 = json["nh3"];

            g_gauge.set(ox);
            g2_gauge.set(red/1000);
            g3_gauge.set(nh3/1000); 
        }
    };

    xhttp.open("GET", "/db_gauge_gas", true);
    xhttp.send();
}
getLastGas();


/* Light Gauge */
var l_opts = {
    angle: -0.2,
    lineWidth: 0.2,
    radiusScale: 1,
    pointer: {
        length: 0.5,
        strokeWidth: 0.035,
        color: '#000000'
    },
    limitMax: true,
    limitMin: true,
    highDpiSupport: true,
    staticLabels: {
        font: "10px sans-serif",
        labels: [],
        color: "#e4ffff",
        fractionDigits: 0
    },
    staticZones: [
        { strokeStyle: "black", min: Math.log(1), max: Math.log(5) },
        { strokeStyle: "#131202", min: Math.log(5), max: Math.log(10) },
        { strokeStyle: "#444006", min: Math.log(10), max: Math.log(20) },
        { strokeStyle: "#C2B715", min: Math.log(20), max: Math.log(40) },
        { strokeStyle: "#DED218", min: Math.log(40), max: Math.log(60) },
        { strokeStyle: "#F2E51C", min: Math.log(60), max: Math.log(100) },
        { strokeStyle: "#FCF57D", min: Math.log(100), max: Math.log(200) },
        { strokeStyle: "#FAF6BB", min: Math.log(200), max: Math.log(300) },
        { strokeStyle: "#FCF9D2", min: Math.log(300), max: Math.log(500) },
        { strokeStyle: "#FFFFFF", min: Math.log(500), max: Math.log(1400) },

    ],
};

var l_target = document.getElementById('l_gauge');
var l_gauge = new Gauge(l_target).setOptions(l_opts);
l_gauge.setMinValue(Math.log(1));
l_gauge.maxValue = Math.log(1400);

var l_textRenderer = new TextRenderer(document.getElementById("l_preview-textfield"));
l_textRenderer.render = function (gauge) {
    if (gauge.displayedValue == gauge.maxValue) {
        this.el.innerHTML = ">" + (Math.exp(gauge.displayedValue)).toFixed(0);
    }
    else {
        this.el.innerHTML = (Math.exp(gauge.displayedValue)).toFixed(0);
    }
};
l_gauge.setTextField(l_textRenderer);


/* Actualizare lumina */
function getLastLight() {
    var xhttp;
    xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText);
            let lux = json["light"];

            l_gauge.set(Math.log(lux));
        }
    };

    xhttp.open("GET", "/db_gauge_light", true);
    xhttp.send();
}
getLastLight();


/* Actualizare periodica */ 
function getLastValues(){
    getLastWeather();
    getLastNoise();
    getLastGas();
    getLastLight();
}

setInterval(getLastValues, 3000);