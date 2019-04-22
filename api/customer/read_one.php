<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

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

    // set ID property of record to read
    $customer->custid = isset($_GET['id']) ? $_GET['id'] : die();

    // read the details of customer to be edited
    $customer->readOne();

    if ($customer->companyname != null) {
        // create array
        $customer_arr = array(
            "custid" => $customer->custid,
            "companyname" => $customer->companyname,
            "contactname" => $customer->contactname,
            "contacttitle" => $customer->contacttitle,
            "address" => $customer->address,
            "city" => $customer->city,
            "region" => $customer->region,
            "postalcode" => $customer->postalcode,
            "country" => $customer->country,
            "phone" => $customer->phone,
            "fax" => $customer->fax
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($customer_arr);
    } else {
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user customer does not exist
        echo json_encode(array("message" => "Customer does not exist."));
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}