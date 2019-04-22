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

    // get id of employee to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of employee to be edited
    $employee->empid = $data->empid;

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

// update the employee
    if ($employee->update()) {

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "Employee was updated."));
    } // if unable to update the employee, tell the user
    else {

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "Unable to update employee."));
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}