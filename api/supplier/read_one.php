<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

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

    // set ID property of record to read
    $supplier->supplierid = isset($_GET['id']) ? $_GET['id'] : die();

    // read the details of supplier to be edited
    $supplier->readOne();

    if ($supplier->companyname != null) {
        // create array
        $supplier_arr = array(
            "supplierid" => $supplier->supplierid,
            "companyname" => $supplier->companyname,
            "contactname" => $supplier->contactname,
            "contacttitle" => $supplier->contacttitle,
            "address" => $supplier->address,
            "city" => $supplier->city,
            "region" => $supplier->region,
            "postalcode" => $supplier->postalcode,
            "country" => $supplier->country,
            "phone" => $supplier->phone,
            "fax" => $supplier->fax
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($supplier_arr);
    } else {
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user supplier does not exist
        echo json_encode(array("message" => "Supplier does not exist."));
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}