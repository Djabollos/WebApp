var sampleTimeSec = 1;
var sampleTimeMsec = 1000*sampleTimeSec;
var maxSamplesNumber = 100;				///< maximum number of samples

var xdata; ///< x-axis labels array: time stamps
var ydata1; ///< y-axis data array: random value
var ydata2;
var ydata3;
 
var lastTimeStamp; ///< most recent time stamp 

var chartContext;  ///< chart context i.e. object that "owns" chart
var chart
var chart3
var chart2; ///< Chart.js object

var mostNegativeValue = -35;
var mostPositiveValue = 1260;

var a = '192.168.8.128';
var zmienna;

var timer; ///< request timer

//const url = 'http://192.168.8.128/dane_pomiarowe.json'; ///< server app with JSON API

function odczyt_adresu() {
	$.ajax({
		type: 'GET',
		url: "http://"+a+"/ustawienia.json",
		success: function(response) {
			zmienna = response.adres_serwera;
			port = parseFloat(response.port_serwera);
		}
	});
}

$.ajaxSetup({ cache: false });
/**
* @brief Add new value to next data point.
* @param y New y-axis value 
*/
function addData1(y){
	if(ydata1.length > maxSamplesNumber)
	{
		removeOldData();
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata1.push(y);
	chart.update();
}
function addData2(y){
	if(ydata2.length > maxSamplesNumber)
	{
		removeOldData();
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata2.push(y);
	chart1.update();
}
function addData3(y){
	if(ydata3.length > maxSamplesNumber)
	{
		removeOldData();
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata3.push(y);
	chart2.update();
}

/**
* @brief Remove oldest data point.
*/
function removeOldData(){
	xdata.splice(0,1);
	ydata1.splice(0,1);
	ydata2.splice(0,1);
	ydata3.splice(0,1);
}

/**
* @brief Start request timer
*/
function startTimer(){
	sampleTimeMsec = parseInt($('#sampletime').val());
	maxSamplesNumber = parseInt($('#samplenumber').val());
	sampleTimeSec = parseFloat(sampleTimeMsec/1000);

	timer = setInterval(ajaxJSON, sampleTimeMsec);
	const url = 'http://'+zmienna+'/configpogoda.php';
	$.post(url, {sampletime2:sampleTimeMsec,samplenumber2:maxSamplesNumber});
}


/**
* @brief Stop request timer
*/
function stopTimer(){
	clearInterval(timer);
}

/**
* @brief Send HTTP GET request to IoT server
*/
function ajaxJSON() {
	$.ajax('http://'+zmienna+'/dane_pomiarowe.json', {
		type: 'GET', dataType: 'json',
		success: function(responseJSON, status, xhr) {
			addData1(+responseJSON.Temperature);
			addData2(+responseJSON.Pressure);
			addData3(+responseJSON.Humidity);
		}
	});
}



/**
* @brief Chart initialization
*/
		
function chartInit()
{
		
	// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata);

	// last value of 'xdata'
	lastTimeStamp = +xdata[xdata.length-1]; 

	// empty array
	ydata1 = []; 
	ydata2 = [];
	ydata3 = [];

	// get chart context from 'canvas' element
	chartContext = $("#chart")[0].getContext('2d');
	chartContext1 = $("#chart1")[0].getContext('2d');
	chartContext2 = $("#chart2")[0].getContext('2d');
	
	
	chart = new Chart(chartContext, {
		
		// The type of chart: linear plot
		type: 'line',
		
		// Dataset: 'xdata' as labels, 'ydata1' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'temperatura',
				backgroundColor: 'rgb(255, 0, 0)',
				borderColor: 'rgb(255, 0, 0)',
				data: ydata1,
				lineTension: 0
			}]
			
		},

		// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					
					ticks: {
	
                    suggestedMin: 0,
                    suggestedMax: 1
                },
					scaleLabel: {
						display: true,
						labelString: 'temperatura [oC]'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});
	
	
	
	
	
	
	
	chart1 = new Chart(chartContext1, {
		// The type of chart: linear plot
		type: 'line',

		// Dataset: 'xdata' as labels, 'ydata1' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'cisnienie',
				backgroundColor: 'rgb(0, 255, 0)',
				borderColor: 'rgb(0, 255, 0)',
				data: ydata2,
				lineTension: 0
			}]
		},

		// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
						ticks: {
                    suggestedMin: 0,
                    suggestedMax: 1
                },
				scaleLabel: {
						display: true,
						labelString: 'cisnienie [hPa]'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});
	
	
	
	
	
	
	
	chart2 = new Chart(chartContext2, {
		// The type of chart: linear plot
		type: 'line',

		// Dataset: 'xdata' as labels, 'ydata1' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'wilgotnosc',
				backgroundColor: 'rgb(0, 0, 255)',
				borderColor: 'rgb(0, 0, 255)',
				data: ydata3,
				lineTension: 0
			}]
		},

		// Configuration options
		options: {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			scales: {
				yAxes: [{
					ticks: {
                    suggestedMin: 0,
                    suggestedMax: 1
                },
					scaleLabel: {
						display: true,
						labelString: 'wilgotnosc [%]'
					}
				}],
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: 'Time [s]'
					}
				}]
			}
		}
	});
	
	ydata1 = chart.data.datasets[0].data;
	ydata2 = chart1.data.datasets[0].data;
	ydata3 = chart2.data.datasets[0].data;
	
	xdata = chart.data.labels;
}

$(document).ready(() => { 
	odczyt_adresu();
	$("#start").click(startTimer);
	chartInit();
	$("#stop").click(stopTimer);
	
	//$("#sampletime").text(odczyt);
	//$("#samplenumber").text(maxSamplesNumber.toString());
});