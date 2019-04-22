<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/core.php';
include_once '../shared/utilities.php';
include_once '../config/database.php';
include_once '../objects/category.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if(isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))){

    // utilities
    $utilities = new Utilities();

    // instantiate database and category object
    $database = new Database();
    $db = $database->getConnection();
    $category = new Category($db);

    // query categories
    $stmt = $category->readPaging($from_record_num, $records_per_page);
    $num = $stmt->rowCount();

    // check if more than 0 record found
    if($num>0){

        // categories array
        $categories_arr=array();
        $categories_arr["records"]=array();
        $categories_arr["paging"]=array();

        // retrieve our table contents
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            $category_item=array(
                "categoryid" => $categoryid,
                "categoryname" => $categoryname,
                "description" => html_entity_decode($description)
            );

            array_push($categories_arr["records"], $category_item);
        }

        // include paging
        $total_rows=$category->count();
        $page_url="{$home_url}category/read_paging.php?";
        $paging=$utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
        $categories_arr["paging"]=$paging;

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($categories_arr);
    }

    else{

        // set response code - 404 Not found
        http_response_code(404);

        // tell the user categories does not exist
        echo json_encode(
            array("message" => "No categories found.")
        );
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}

