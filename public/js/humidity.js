var myChart;

function create_chart(xlabels, ytemps, period) {
    var ctx = document.getElementById('humidityChart').getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0.05, '#1A52F7');
    gradient.addColorStop(0.3, '#1AF7CA');
    gradient.addColorStop(0.55, '#025044');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [
                {
                    label: 'Temperatura',
                    data: ytemps,
                    lineTension: 0.1,
                    cubicInterpolationMode: "monotone",
                    borderColor: 'rgba(255, 255, 255, 1)',
                    // backgroundColor: 'rgba(147, 230, 217, 0.7)',
                    pointRadius: 5,
                    pointHoverRadius: 12,
                    pointHoverBackgroundColor: '#e4ffff',
                    backgroundColor: gradient,
                    borderWidth: 1
                }
            ]
        },
        options: {
            tooltips: {
                callbacks: {
                    title: function () {
                        return "";
                    },
                    label: function (item, data) {
                        return item.yLabel + "%";
                    }
                }
            },

            legend: {
                display: false,
                labels: {
                    fontColor: "#e4ffff",
                    fontSize: 22
                }
            },
            scales: {
                yAxes: [{
                  
                    ticks: {
                        suggestedMin: 25,
                        suggestedMax: 35,
                        fontColor: '#e4ffff',
                        callback: function(value, index, values) {
                            return value.toFixed(2) + "%";
                        }
                    }
                    
                }],
                xAxes: [{
                    ticks: {
                        fontColor: '#e4ffff',
                        callback: function (value, index, values) {
                            let time = "!";
                            var myDate = new Date(value);
                            switch (period) {
                                case "Day":
                                    time = `${(myDate.getHours()).pad(2)}:00`;
                                    break;
                                case "Month":
                                    var userTimezoneOffset = myDate.getTimezoneOffset() * 60000;
                                    myDate = new Date(myDate.getTime() - userTimezoneOffset);
                                    time = `${(myDate.getUTCDate()).pad(2)}.${(myDate.getMonth() + 1).pad(2)}`;
                                    break;
                                case "Year":
                                    time = `${(myDate.getMonth() + 1).pad(2)}.${(myDate.getFullYear()).pad(2)}`;
                                    break;
                                case "All":
                                    time = `${(myDate.getMonth() + 1).pad(2)}.${(myDate.getFullYear()).pad(2)}`;
                                    break;
                            }
                            return time;
                        }
                    }
                }],


            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });
}


function get_data(index) {
    var xhttp;
    xhttp = new XMLHttpRequest();
    let dict = {
        0: "Day",
        1: "Month",
        2: "Year",
        3: "All"
    };
    let period = dict[index];
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(this.responseText);  // rows, format json

            // document.getElementById("loader").innerHTML = json[0].time;
            let xlabels = [];
            let ytemps = [];
            json.forEach(element => {
                xlabels.push(element.time);
                ytemps.push(Math.round(element.humidity * 100) / 100);
            });

            create_chart(xlabels, ytemps, period);
        }
    };

    let querry = `?period=${period}`;
    xhttp.open("GET", "/db_humidity" + querry, true);
    xhttp.send();
}


const selectElement = document.querySelector('#perioada');


selectElement.addEventListener('change', (event) => {
    var index = $(selectElement).prop('selectedIndex');
    // sterge vechiul grafic
    myChart.destroy();
    get_data(index);
});


// setInterval(function(){
//     var index = $(selectElement).prop('selectedIndex');
//     // sterge vechiul grafic
//     myChart.destroy();
//     get_data(index);
// }, 5000);


// prima apelare a functiei
get_data(0);


Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
};