<?php
$ledDisplay = array();
$ledDisplayFile = fopen('led_text.json', w);

$ledDisplay['text'] = $_POST['text'];
$ledDisplay['kolor'] = $_POST['kolor'];

$ledDisplayJson = json_encode($ledDisplay);
fwrite($ledDisplayFile, $ledDisplayJson);
fclose($ledDisplayFile);

exec("sudo ./led_text.py");
?>