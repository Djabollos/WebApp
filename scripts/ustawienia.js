var a = '192.168.8.128';	//standardowe ip

/**
* @brief Wysyla zadanie HTTP POST do serwera IoT
* @note zapisuje ip oraz port podany przez uzytkownika do pliku
*/
function zapis_do_pliku(){
	dane = {
	adres_s: $("#adres_s").val(),
	port_s: $("#port_s").val()
	}
	$.ajax({
		type: 'POST',
		url: "http://192.168.8.128/ustawienia.php",
		data: dane,
		success: function(respons) {
			console.log(dane);
			a = $("#adres_s").val();
		}
	});

}

/**
* @brief Wysyla zadanie HTTP GET do serwera IoT
* @note odczytuje z pliku serwera informacje o ip oraz porcie
*/
function odczyt_adresu() {
	$.ajax({
		type: 'GET',
		url: "http://"+a+"/ustawienia.json",
		success: function(response) {
			adres = response.adres_serwera;
			port = parseFloat(response.port_serwera);
			
			$("#adres_s").val(adres.toString());
			$("#port_s").val(port.toString());
		}
	});
}

/**
* @brief Wykonanie funkcji po uruchomieniu okna htm
*/
$(document).ready(() => { 
	odczyt_adresu();
	//$("#adres_s").val(ip); //document.getElementById("adres_s").value = ip;
	$("#zmiana").click(zapis_do_pliku);
});