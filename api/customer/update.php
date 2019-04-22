<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/customer.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if (isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))) {

    // get database connection
    $database = new Database();
    $db = $database->getConnection();

    // prepare customer object
    $customer = new Customer($db);

    // get id of customer to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of customer to be edited
    $customer->custid = $data->custid;

    // set customer property values
    $customer->companyname = $data->companyname;
    $customer->contactname = $data->contactname;
    $customer->contacttitle = $data->contacttitle;
    $customer->address = $data->address;
    $customer->city = $data->city;
    $customer->region = $data->region;
    $customer->postalcode = $data->postalcode;
    $customer->country = $data->country;
    $customer->phone = $data->phone;
    $customer->fax = $data->fax;

    // update the customer
    if ($customer->update()) {

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "Customer was updated."));
    } // if unable to update the customer, tell the user
    else {

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "Unable to update customer."));
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}