var a = '192.168.8.128';
//const Adres = 'http://192.168.8.128/led_one.php';
//const Adres2 = 'http://192.168.8.128/led_text.php';
var zmienna;

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

function dioda(){
	Dane = {
	poziom: $('#poziom').val(),
	pion: $('#pion').val(),
	kolor: $('#kolor').val()
	}
	$.ajax({
		type: 'POST',
		url: 'http://'+zmienna+'/led_one.php',
		data: Dane,
		success: function(respons) {
			console.log(Dane);
		}
	});
}

function napis(){
	Dane2 = {
	text: $('#napis').val(),
	kolor: $('#kolor2').val()
	}
	$.ajax({
		type: 'POST',
		url: 'http://'+zmienna+'/led_text.php',
		data: Dane2,
		success: function(respons) {
			console.log(Dane2);
		}
	});
}

$(document).ready(() => { 
	odczyt_adresu();
	$("#btn").click(dioda);
	$("#wyswietl").click(napis);
});