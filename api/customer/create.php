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
if(isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))){

    // instantiate database and category object
    $database = new Database();
    $db = $database->getConnection();
    $customer = new Customer($db);

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    // make sure data is not empty
    if(
        !empty($data->companyname) &&
        !empty($data->contactname) &&
        !empty($data->contacttitle) &&
        !empty($data->address) &&
        !empty($data->city) &&
        !empty($data->country) &&
        !empty($data->phone)

    ){

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

        // create the customer
        if($customer->create()){

            // set response code - 201 created
            http_response_code(201);

            // tell the user
            echo json_encode(array("message" => "Customer was created."));
        }

        // if unable to create the customer, tell the user
        else{

            // set response code - 503 service unavailable
            http_response_code(503);

            // tell the user
            echo json_encode(array("message" => "Unable to create customer."));
        }
    }

    // tell the user data is incomplete
    else{

        // set response code - 400 bad request
        http_response_code(400);

        // tell the user
        echo json_encode(array("message" => "Unable to create customer. Data is incomplete."));
    }

} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}