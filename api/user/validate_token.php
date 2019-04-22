<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/rest-api-authentication-example/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include object files
include_once '../shared/token.php';

// instantiate token object
$token = new Token();

// get payload from jwt
$payload = $token->validate(json_decode(file_get_contents("php://input"))->jwt);

// if payload is not empty
if($payload){
    // set response code
    http_response_code(200);
    // show user details
    echo json_encode(array(
        "message" => "Access granted.",
        "data" => $payload
    ));
}
// show error message if jwt is empty
else{
    // set response code
    http_response_code(401);
    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}