var a = '192.168.8.128';	//standardowe ip
var zmienna;				//zmienna ktorej nadaje sie ip
//const Adres = 'http://192.168.8.128/led_one.php';
//const Adres2 = 'http://192.168.8.128/led_text.php';

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
* @note zapisuje na serwerze informacje podane przez uzytkownika: pojedyncza dioda
*/
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

/**
* @brief Wysyla zadanie HTTP POST do serwera IoT
* @note zapisuje na serwerze informacje podane przez uzytkownika: wyswietlany tekst
*/
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

/**
* @brief Wykonanie funkcji po uruchomieniu okna htm
*/
$(document).ready(() => { 
	odczyt_adresu();
	$("#btn").click(dioda);
	$("#wyswietl").click(napis);
});