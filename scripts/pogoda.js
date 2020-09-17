var sampleTimeSec = 1;						//czas probkowania w sekundach
var sampleTimeMsec = 1000*sampleTimeSec;	//czas probkowania w milisekundach
var maxSamplesNumber = 100;					//maksymalna liczba probek

var xdata; 	//dane na osi x: czas
var ydata1; //dane na osi y: temperatura
var ydata2;	//dane na osi y: ciesnienie
var ydata3;	//dane na osi y:
 
var lastTimeStamp; //najnowszy znacznik czasu

var chartContext;  //kontekst wykresu(obiekt bedacy 'wlascicielem' wykresu)
var chart		//obiekt Chart.js: temperatura
var chart1		//obiekt Chart.js: ciesnienie
var chart2; 	//obiekt Chart.js: wilgotnosc

var mostNegativeValue = -35;	//maksymalna ujemna wartosc osi y
var mostPositiveValue = 1260;	//maksymalna dodatnia wartosc osi y

var a = '192.168.8.128';	//standardowe ip
var zmienna;				//zmienna ktorej nadaje sie ip

var timer; 		//do obslugi timera

//const url = 'http://192.168.8.128/dane_pomiarowe.json';

/**
* @brief Wysyla zadanie HTTP GET do serwera IoT
* @note odczytuje z pliku serwera informacje o ip oraz porcie
*/
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
* @brief Dodaje nowa wartosc do nastepnego punktu danych
* @param y nowa wartosc temperatury na osi y 
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
/**
* @brief Dodaje nowa wartosc do nastepnego punktu danych
* @param y nowa wartosc ciesnienia na osi y 
*/
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
/**
* @brief Dodaje nowa wartosc do nastepnego punktu danych
* @param y nowa wartosc wilgotnosci na osi y 
*/
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
* @brief Usuwa najstarszy punkt danych
*/
function removeOldData(){
	xdata.splice(0,1);
	ydata1.splice(0,1);
	ydata2.splice(0,1);
	ydata3.splice(0,1);
}

/**
* @brief Start timera oraz zadanie HTTP POST
* @note funkcja odczytuje takze wartosci podane przez uzytkownika i wysyla je na serwer
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
* @brief Stop timera
*/
function stopTimer(){
	clearInterval(timer);
}

/**
* @brief Wysyla zadanie HTTP GET do serwera IoT
* @note odczytuje wszystkie dane pogodowe z pliku serwera
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
* @brief Inicjalizacja wykresu
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

/**
* @brief Wykonanie funkcji po uruchomieniu okna htm
*/
$(document).ready(() => { 
	odczyt_adresu();
	$("#start").click(startTimer);
	chartInit();
	$("#stop").click(stopTimer);
	
	//$("#sampletime").text(odczyt);
	//$("#samplenumber").text(maxSamplesNumber.toString());
});