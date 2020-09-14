var a = '192.168.8.128';
//var ip = parsedocument.getElementById("adres_s").value;
//var url = "http://"+a+"/ustawienia.php";
//var url2 = "http://"+a+"/ustawienia.json";
//$("#tem").text(ip.toString());
//var wynik = obliczenia[format()](wartosc).toString();

/**
* @brief Send HTTP POST request to IoT server
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
* @brief Send HTTP GET request to IoT server
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

$(document).ready(() => { 
	odczyt_adresu();
	//$("#adres_s").val(ip); //document.getElementById("adres_s").value = ip;
	$("#zmiana").click(zapis_do_pliku);
});