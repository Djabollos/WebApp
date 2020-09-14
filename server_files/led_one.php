<?php
$ledDisplay = array();
$ledDisplayFile = fopen('led_single.json', w);

$ledDisplay['poziom'] = (int)json_decode($_POST['poziom']);
$ledDisplay['pion'] = (int)json_decode($_POST['pion']);
$ledDisplay['kolor'] = $_POST['kolor'];

$ledDisplayJson = json_encode($ledDisplay);
fwrite($ledDisplayFile, $ledDisplayJson);
fclose($ledDisplayFile);

exec("sudo ./led_display.py");
?>