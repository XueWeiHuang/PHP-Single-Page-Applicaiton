<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../shared/token.php';

// json web token

$token = new Token();

$data = $token->validate((apache_request_headers()['Authorization']));

echo  $data->email;