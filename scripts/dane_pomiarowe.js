var a = '192.168.8.128'; //standardowe ip
var zmienna;			 //zmienna ktorej nadaje sie ip
var port; 				 //zmienna ktorej nadaje sie nr portu
var timer; 				 //do obslugi timera

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
* @brief Wysyla zadanie HTTP GET do serwera IoT
* @note odczytuje wszystkie dane pomiarowe i ustawia je w tabeli
*/
function odczyt() {
	//odczyt_adresu();
	$.ajax({
		type: 'GET',
		url: 'http://'+zmienna+'/dane_pomiarowe.json',
		success: function(response) {
			temperatura = parseFloat(response.Temperature);
			wilgotnosc = parseFloat(response.Humidity);
			cisnienie = parseFloat(response.Pressure);
			roll = parseFloat(response.roll);
			pitch = parseFloat(response.pitch);
			yaw = parseFloat(response.yaw);
			xaxis = parseFloat(response.xaxis);
			yaxis = parseFloat(response.yaxis);
			buttonpressed = parseFloat(response.buttonpressed);
			
			$("#temper").text(temperatura.toString());
			$("#cisn").text(cisnienie.toString());
			$("#wilg").text(wilgotnosc.toString());
			$("#roll").text(roll.toString());
			$("#pitch").text(pitch.toString());
			$("#yaw").text(yaw.toString());
			$("#xaxis").text(xaxis.toString());
			$("#yaxis").text(yaxis.toString());
			$("#buttonpressed").text(buttonpressed.toString());
			console.log(zmienna);
			console.log(temperatura);
		}
	});
	
}

/**
* @brief Start timera
*/
function startTimer(){
	odczyt();
	timer = setInterval(odczyt, 1000);
}

/**
* @brief Zatrzymanie timera
*/
function stopTimer(){
	clearInterval(timer);
}

/**
* @brief Wykonanie funkcji po uruchomieniu okna htm
*/
$(document).ready(() => { 
	//odczyt();
	odczyt_adresu();
	$("#btn").click(startTimer);
	$("#stop").click(stopTimer);
});