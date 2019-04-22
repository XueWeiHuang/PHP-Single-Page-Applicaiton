<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/employee.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if (isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))) {

    // instantiate database and employee object
    $database = new Database();
    $db = $database->getConnection();
    $employee = new Employee($db);

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    // make sure data is not empty
    if (
        !empty($data->lastname) &&
        !empty($data->firstname) &&
        !empty($data->title) &&
        !empty($data->titleofcourtesy) &&
        !empty($data->birthdate) &&
        !empty($data->hiredate) &&
        !empty($data->address) &&
        !empty($data->city) &&
        !empty($data->country) &&
        !empty($data->phone)
    ) {

        // set employee property values
        $employee->lastname = $data->lastname;
        $employee->firstname = $data->firstname;
        $employee->title = $data->title;
        $employee->titleofcourtesy = $data->titleofcourtesy;
        $employee->birthdate = $data->birthdate;
        $employee->hiredate = $data->hiredate;
        $employee->address = $data->address;
        $employee->city = $data->city;
        $employee->region = $data->region;
        $employee->postalcode = $data->postalcode;
        $employee->country = $data->country;
        $employee->phone = $data->phone;
        $employee->mgrid = $data->mgrid;

        // create the employee
        if ($employee->create()) {

            // set response code - 201 created
            http_response_code(201);

            // tell the user
            echo json_encode(array("message" => "Employee was created."));
        } // if unable to create the employee, tell the user
        else {

            // set response code - 503 service unavailable
            http_response_code(503);

            // tell the user
            echo json_encode(array("message" => "Unable to create employee."));
        }
    } // tell the user data is incomplete
    else {

        // set response code - 400 bad request
        http_response_code(400);

        // tell the user
        echo json_encode(array("message" => "Unable to create employee. Data is incomplete."));
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}