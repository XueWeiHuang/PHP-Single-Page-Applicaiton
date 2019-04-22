<?php
// include database and object files
include_once '../config/database.php';
include_once '../objects/category.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if(isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))){


} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}