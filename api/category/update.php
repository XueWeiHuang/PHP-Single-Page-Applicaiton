<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/category.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if(isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))){

    // instantiate database and category object
    $database = new Database();
    $db = $database->getConnection();
    $category = new Category($db);

    // get id of category to be edited
    $data = json_decode(file_get_contents("php://input"));

    // set ID property of category to be edited
    $category->categoryid = $data->categoryid;

    // set category property values
    $category->categoryname = $data->categoryname;
    $category->description = $data->description;

    // update the category
    if($category->update()){

        // set response code - 200 ok
        http_response_code(200);

        // tell the user
        echo json_encode(array("message" => "Category was updated."));
    }

    // if unable to update the category, tell the user
    else{

        // set response code - 503 service unavailable
        http_response_code(503);

        // tell the user
        echo json_encode(array("message" => "Unable to update category."));
    }

} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}