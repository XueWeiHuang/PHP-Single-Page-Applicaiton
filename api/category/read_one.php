<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

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

    // set ID property of record to read
    $category->categoryid = isset($_GET['id']) ? $_GET['id'] : die();

    // read the details of category to be edited
    $category->readOne();

    if($category->categoryname!=null){
        // create array
        $category_arr = array(
            "categoryid" =>  $category->categoryid,
            "categoryname" => $category->categoryname,
            "description" => $category->description
        );

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($category_arr);
    }

    else{
        // set response code - 404 Not found
        http_response_code(404);

        // tell the user category does not exist
        echo json_encode(array("message" => "Category does not exist."));
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}

