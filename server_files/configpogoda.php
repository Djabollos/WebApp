<?php

$data = array();

$data["sampletime"] = $_POST['sampletime2'];
$data["samplenumber"] = $_POST['samplenumber2'];

$data_file = fopen("configpogoda.json", w);
$data_json = json_encode($data);
fwrite($data_file, $data_json);
fclose($data_file);

echo "hello"
?>