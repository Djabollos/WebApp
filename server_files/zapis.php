<?php
$tablica = array();
$fp = fopen('zapisane_dane.json', w);

$tablica['czas_probkowania'] = $_POST['czaspro'];
$tablica['liczba_probek'] = $_POST['liczbapro'];

$tablicaJson = json_encode($tablica);
fwrite($fp, $tablicaJson);
fclose($fp);
?>