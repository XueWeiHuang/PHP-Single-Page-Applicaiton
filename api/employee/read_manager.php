<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

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

    // initialize object
    $employee = new Employee($db);

    // query employee
    $stmt = $employee->readNames();
    $num = $stmt->rowCount();

    // check if more than 0 record found
    if ($num > 0) {

        // managers array
        $managers_arr = array();
        $managers_arr["records"] = array();

        // retrieve our table contents
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            $manager_item = array(
                "mgrid" => $empid,
                "manager" => $manager
            );

            array_push($managers_arr["records"], $manager_item);
        }

        // set response code - 200 OK
        http_response_code(200);

        // show employees data in json format
        echo json_encode($managers_arr);
    } else {

        // set response code - 404 Not found
        http_response_code(404);

        // tell the user no employees found
        echo json_encode(
            array("message" => "No managers found.")
        );
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}
