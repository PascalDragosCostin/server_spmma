var myChart;

function  create_chart(xlabels, oxs, reds, nh3s, period) {
    // min si max pentru scalare
    // let min = ytemps.reduce((min, y) => y < min ? y : min, ytemps[0]);
    // let max = ytemps.reduce((max, y) => y > max ? y : max, ytemps[0]);

    var ctx = document.getElementById('gasChart').getContext('2d');
    var gradient = ctx.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0.15, '#F6F49A');
    gradient.addColorStop(0.3, '#C5C135');
    gradient.addColorStop(0.50, '#0A0900');
    var gradient2 = ctx.createLinearGradient(0, 0, 0, 800);
    gradient2.addColorStop(0.15, 'red');
    gradient2.addColorStop(0.3, 'yellow');
    gradient2.addColorStop(0.50, 'blue');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: xlabels,
            datasets: [
                {
                    label: 'Ox',
                    data: oxs,
                    lineTension: 0.5,
                    cubicInterpolationMode: "monotone",
                    borderColor: '#04FFB5',
                    backgroundColor: 'rgba(145, 245, 221, 0.5)',
                    pointBackgroundColor: '#04FFB5',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#e4ffff',
                    //backgroundColor: gradient,
                    borderWidth: 1
                },
                {
                    label: 'RED',
                    data: reds,
                    lineTension: 0.1,
                    cubicInterpolationMode: "monotone",
                    borderColor: 'red',
                    backgroundColor: 'rgba(238, 78, 73, 0.5)',
                    pointBackgroundColor: 'red',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#e4ffff',
                    //backgroundColor: gradient,
                    borderWidth: 1
                },
                {
                    label: 'NH3',
                    data: nh3s,
                    lineTension: 0.1,
                    cubicInterpolationMode: "monotone",
                    borderColor: '#E1FF04',
                    backgroundColor: 'rgba(224, 247, 61, 0.5)',
                    pointBackgroundColor: 'rgba(224, 247, 61, 1)',

                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#e4ffff',
                    //backgroundColor: gradient,
                    borderWidth: 1
                },
                
            ]
        },
        options: {
            tooltips: {
                callbacks: {
                    title: function () {
                        return "";
                    },
                    label: function (item, data) {
                        return item.yLabel;
                    }
                }
            },

            legend: {
                display: true,
                labels: {
                    fontColor: "#e4ffff",
                    fontSize: 22
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: -0.5,
                        suggestedMax: 0.5,
                        fontColor: '#e4ffff',
                        callback: function (value, index, values) {
                            if (value > 0) 
                            {
                                return "+" + value.toFixed(2) + "%";
                            }else
                            if(value == 0)
                            {
                                return "Media"
                            }
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
            let oxs = [];
            let reds = [];
            let nh3s = [];
            json.forEach(element => {
                xlabels.push(element.time);
                oxs.push(element.ox);
                reds.push(element.red);
                nh3s.push(element.nh3);
            });
            
            create_chart(xlabels, scale_array(oxs), scale_array(reds), scale_array(nh3s), period);
        }
    };

    let querry = `?period=${period}`;
    xhttp.open("GET", "/db_gas" + querry, true);
    xhttp.send();
}

function scale_array(arr)
{
    let average = (array) => array.reduce((a, b) => a + b, 0) / array.length;
            
    let min = Math.min(...arr);
    let max = Math.max(...arr);
    let avg = average(arr);

    arr = arr.map(x => (x-avg)/(max-min));

    return arr;
}

const selectElement = document.querySelector('#perioada');


selectElement.addEventListener('change', (event) => {
    var index = $(selectElement).prop('selectedIndex');
    // sterge vechiul grafic
    myChart.destroy();
    get_data(index);
});



// prima apelare a functiei
get_data(0);


Number.prototype.pad = function (size) {
    var s = String(this);
    while (s.length < (size || 2)) { s = "0" + s; }
    return s;
};