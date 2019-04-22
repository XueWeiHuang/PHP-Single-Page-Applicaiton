<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/supplier.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if (isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))) {

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare supplier object
    $supplier = new Supplier($db);

    // get id of supplier to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of supplier to be edited
    $supplier->supplierid = $data->supplierid;

    // set supplier property values
    $supplier->companyname = $data->companyname;
    $supplier->contactname = $data->contactname;
    $supplier->contacttitle = $data->contacttitle;
    $supplier->address = $data->address;
    $supplier->city = $data->city;
    $supplier->region = $data->region;
    $supplier->postalcode = $data->postalcode;
    $supplier->country = $data->country;
    $supplier->phone = $data->phone;
    $supplier->fax = $data->fax;

    // update the supplier
    if ($supplier->update()) {

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "Supplier was updated."));
    } // if unable to update the supplier, tell the user
    else {

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "Unable to update supplier."));
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}