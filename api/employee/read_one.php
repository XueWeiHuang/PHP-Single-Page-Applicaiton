<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

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

    // set ID property of record to read
    $employee->empid = isset($_GET['id']) ? $_GET['id'] : die();

    // read the details of employee to be edited
    $employee->readOne();

    if ($employee->lastname != null) {
        // create array
        $employee_arr = array(
            "empid" => $employee->empid,
            "lastname" => $employee->lastname,
            "firstname" => $employee->firstname,
            "title" => $employee->title,
            "titleofcourtesy" => $employee->titleofcourtesy,
            "birthdate" => $employee->birthdate,
            "hiredate" => $employee->hiredate,
            "address" => $employee->address,
            "city" => $employee->city,
            "region" => $employee->region,
            "postalcode" => $employee->postalcode,
            "country" => $employee->country,
            "phone" => $employee->phone,
            "mgrid" => $employee->mgrid
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($employee_arr);
    } else {
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user employee does not exist
        echo json_encode(array("message" => "Employee does not exist."));
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}