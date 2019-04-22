<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/core.php';
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

    // get keywords
    $keywords = isset($_GET["s"]) ? $_GET["s"] : "";

    // query employees
    $stmt = $employee->search($keywords);
    $num = $stmt->rowCount();

    // check if more than 0 record found
    if ($num > 0) {

        // employee array
        $employee_arr = array();
        $employee_arr["records"] = array();

        // retrieve our table contents
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            $employee_item = array(
                "empid" => $empid,
                "name" => $name,
                "title" => $title,
                "phone" => $phone,
                "manager" => $manager
            );

            array_push($employee_arr["records"], $employee_item);
        }

        // set response code - 200 OK
        http_response_code(200);

        // show employees data
        echo json_encode($employee_arr);
    } else {
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user no employees found
        echo json_encode(
            array("message" => "No employees found.")
        );
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}