//const sampleTimeSec = 0.1; 					///< sample time in sec
//const sampleTimeMsec = 1000*sampleTimeSec;	///< sample time in msec
var maxSamplesNumber = 100;				///< maximum number of samples
var sampleTimeMsec;
var sampleTimeSec = 0.1;

var xdata; ///< x-axis labels array: time stamps
var ydata; ///< y-axis data array: random value
var ydata2;
var ydata3;
var lastTimeStamp; ///< most recent time stamp 

var chartContext;  ///< chart context i.e. object that "owns" chart
var chart; ///< Chart.js object

var a = '192.168.8.128';
var zmienna;

var timer; ///< request timer

//const url1 = 'http://192.168.8.128/dane_pomiarowe.json'; ///< server app with JSON 
//const adres = 'http://192.168.8.128/zapis.php';
//const url2 = 'http://192.168.8.128/zapisane_dane.json';

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

function zapis(){
	dane = {
	czaspro: $("#sampletime").val(),
	liczbapro: $("#samplenumber").val()
	}
	$.ajax({
		type: 'POST',
		url: 'http://'+zmienna+'/zapis.php',
		data: dane,
		success: function(respons) {
			console.log(dane);
		}
	});
}

/*function odczyt() {
	$.ajax({
		type: 'GET',
		url: url2,
		success: function(response) {
			sampleTimeMsec = parseFloat(response.czas_probkowania);
			sampleTimeSec = sampleTimeMsec/1000;
			maxSamplesNumber = parseFloat(response.liczba_probek);
		}
	});
}*/

function dana(){
	maxSamplesNumber = parseInt($("#samplenumber").val());
}

/**
* @brief Add new value to next data point.
* @param y New y-axis value 
*/
function addData(y){
	if(ydata.length > maxSamplesNumber)
	{
		removeOldData();
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata.push(y);
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
	chart.update();
}
function addData3(y){
	if(ydata3.length > maxSamplesNumber)
	{
		removeOldData();
		lastTimeStamp += sampleTimeSec;
		xdata.push(lastTimeStamp.toFixed(4));
	}
	ydata3.push(y);
	chart.update();
}
/**
* @brief Remove oldest data point.
*/
function removeOldData(){
	xdata.splice(0,1);
	ydata.splice(0,1);
	ydata2.splice(0,1);
	ydata3.splice(0,1);
}
function czasProb() {
	sampleTimeMsec = parseFloat($("#sampletime").val());
	sampleTimeSec = sampleTimeMsec/1000;
}
/**
* @brief Start request timer
*/
function startTimer(){
	zapis();
	czasProb();
	dana();
	timer = setInterval(ajaxJSON, sampleTimeMsec);
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
			addData(+responseJSON.roll);
			addData2(+responseJSON.pitch);
			addData3(+responseJSON.yaw);
		}
	});
}

/**
* @brief Chart initialization
*/
function chartInit()
{
	//czasProb();
	// array with consecutive integers: <0, maxSamplesNumber-1>
	xdata = [...Array(maxSamplesNumber).keys()]; 
	// scaling all values ​​times the sample time 
	xdata.forEach(function(p, i) {this[i] = (this[i]*sampleTimeSec).toFixed(4);}, xdata);

	// last value of 'xdata'
	lastTimeStamp = +xdata[xdata.length-1]; 

	// empty array
	ydata = [];
	ydata2 = []; 	
	ydata3 = []; 
	// get chart context from 'canvas' element
	chartContext = $("#chart")[0].getContext('2d');

	chart = new Chart(chartContext, {
		// The type of chart: linear plot
		type: 'line',

		// Dataset: 'xdata' as labels, 'ydata' as dataset.data
		data: {
			labels: xdata,
			datasets: [{
				fill: false,
				label: 'Roll',
				backgroundColor: 'rgb(255, 0, 0)',
				borderColor: 'rgb(255, 0, 0)',
				data: ydata,
				lineTension: 0
			}, {
				fill: false,
				label: 'Pitch',
				backgroundColor: 'rgb(0, 255, 0)',
				borderColor: 'rgb(0, 255, 0)',
				data: ydata2,
				lineTension: 0
			}, {
				fill: false,
				label: 'Yaw',
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
					scaleLabel: {
						display: true,
						labelString: 'Degrees'
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
	
	ydata = chart.data.datasets[0].data;
	xdata = chart.data.labels;
}

$(document).ready(() => {
	odczyt_adresu();
	chartInit();
	$("#start").click(startTimer);
	$("#stop").click(stopTimer);
	zapis();
	//$("#sampletime").text(sampleTimeMsec.toString());
	//$("#samplenumber").text(maxSamplesNumber.toString());
});