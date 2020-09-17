var maxSamplesNumber = 100; //maksymalna liczba probek
var sampleTimeMsec; 		//czas probkowania w milisekundach
var sampleTimeSec = 0.1;	//czas probkowania w sekundach

var xdata; 	//dane na osi x: czas
var ydata; 	//dane na osi y: stopnie roll
var ydata2;	//dane na osi y: stopnie pitch
var ydata3;	//dane na osi y: stopnie yaw
var lastTimeStamp; //najnowszy znacznik czasu

var chartContext;  //kontekst wykresu(obiekt bedacy 'wlascicielem' wykresu)
var chart; //obiekt Chart.js

var a = '192.168.8.128';	//standardowe ip
var zmienna;				//zmienna ktorej nadaje sie ip

var timer; //do obslugi timera

//const url1 = 'http://192.168.8.128/dane_pomiarowe.json'; ///< server app with JSON 
//const adres = 'http://192.168.8.128/zapis.php';
//const url2 = 'http://192.168.8.128/zapisane_dane.json';

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

/**
* @brief Wysyla zadanie HTTP POST do serwera IoT
* @note zapisuje do pliku serwera informacje o czasie probkowania i liczbie probkowania
*/
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

/**
* @brief Przypisuje zmiennej liczbe probek odczytana od uzytkownika w htm
*/
function dana(){
	maxSamplesNumber = parseInt($("#samplenumber").val());
}

/**
* @brief Dodaje nowa wartosc do nastepnego punktu danych
* @param y nowa wartosc roll na osi y 
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
/**
* @brief Dodaje nowa wartosc do nastepnego punktu danych
* @param y nowa wartosc pitch na osi y 
*/
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
/**
* @brief Dodaje nowa wartosc do nastepnego punktu danych
* @param y nowa wartosc yaw na osi y 
*/
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
* @brief Usuwa najstarszy punkt danych
*/
function removeOldData(){
	xdata.splice(0,1);
	ydata.splice(0,1);
	ydata2.splice(0,1);
	ydata3.splice(0,1);
}

/**
* @brief Przypisuje zmiennej wartosc czasu probkowania od uzytkownika z htm 
*/
function czasProb() {
	sampleTimeMsec = parseFloat($("#sampletime").val());
	sampleTimeSec = sampleTimeMsec/1000;
}

/**
* @brief Start timera
*/
function startTimer(){
	zapis();
	czasProb();
	dana();
	timer = setInterval(ajaxJSON, sampleTimeMsec);
}

/**
* @brief Stop timera
*/
function stopTimer(){
	clearInterval(timer);
}

/**
* @brief Wysyla zadanie HTTP GET do serwera IoT
* @note odczytuje wszystkie dane katow z pliku serwera
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
* @brief Inicjalizacja wykresu
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

/**
* @brief Wykonanie funkcji po uruchomieniu okna htm
*/
$(document).ready(() => {
	odczyt_adresu();
	chartInit();
	$("#start").click(startTimer);
	$("#stop").click(stopTimer);
	zapis();
	//$("#sampletime").text(sampleTimeMsec.toString());
	//$("#samplenumber").text(maxSamplesNumber.toString());
});