var a = '192.168.8.128';
var zmienna;

var timer;

/**
* @brief Send HTTP GET request to IoT server
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
* @brief Send HTTP GET request to IoT server
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
* @brief Start request timer
*/
function startTimer(){
	odczyt();
	timer = setInterval(odczyt, 1000);
}

/**
* @brief Stop request timer
*/
function stopTimer(){
	clearInterval(timer);
}

/**
* @brief Execution of the function after starting the htm window
*/
$(document).ready(() => { 
	//odczyt();
	odczyt_adresu();
	$("#btn").click(startTimer);
	$("#stop").click(stopTimer);
});