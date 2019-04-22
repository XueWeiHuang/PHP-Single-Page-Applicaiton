<?php
// required headers
header("Access-Control-Allow-Origin: http://localhost/rest-api-authentication-example/");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/user.php';

// get database connection
$database = new Database();
$db = $database->getConnection();

// instantiate user object
$user = new User($db);

// get posted data
$data = json_decode(file_get_contents("php://input"));

// strip whitespace from the beginning and end of posted data
$data->firstname = trim($data->firstname);
$data->lastname = trim($data->lastname);
$data->email = trim($data->email);
$data->password = trim($data->password);

// make sure data is not empty
if (!empty($data->firstname) &&
    !empty($data->lastname) &&
    !empty($data->email) &&
    !empty($data->password)
){
    // set user property values
    $user->firstname = $data->firstname;
    $user->lastname = $data->lastname;
    $user->email = $data->email;
    $user->password = $data->password;

    // create the user
    if($user->create()){

        // set response code
        http_response_code(200);

        // display message: user was created
        echo json_encode(array("message" => "User was created."));
    }

    // message if unable to create user
    else{

        // set response code
        http_response_code(400);

        // display message: unable to create user
        echo json_encode(array("message" => "Unable to create user."));
    }
}
// tell the user data is incomplete
else{

    // set response code - 400 bad request
    http_response_code(400);

    // tell the user
    echo json_encode(array("message" => "Unable to create user. Data is incomplete."));
}

