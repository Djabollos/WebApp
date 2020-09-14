<?php
$tablica = array();
$fp = fopen('ustawienia.json', w);

$tablica['adres_serwera'] = $_POST['adres_s'];
$tablica['port_serwera'] = $_POST['port_s'];

$tablicaJson = json_encode($tablica);
fwrite($fp, $tablicaJson);
fclose($fp);
?>