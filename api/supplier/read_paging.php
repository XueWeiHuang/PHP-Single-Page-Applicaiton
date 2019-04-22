<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/core.php';
include_once '../shared/utilities.php';
include_once '../config/database.php';
include_once '../objects/supplier.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if (isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))) {

    // utilities
    $utilities = new Utilities();

    // instantiate database and supplier object
    $database = new Database();
    $db = $database->getConnection();

    // initialize object
    $supplier = new Supplier($db);

    // query suppliers
    $stmt = $supplier->readPaging($from_record_num, $records_per_page);
    $num = $stmt->rowCount();

    // check if more than 0 record found
    if ($num > 0) {

        // suppliers array
        $suppliers_arr = array();
        $suppliers_arr["records"] = array();
        $suppliers_arr["paging"] = array();

        // retrieve our table contents
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            $supplier_item = array(
                "supplierid" => $supplierid,
                "companyname" => $companyname,
                "contactname" => $contactname,
                "contacttitle" => $contacttitle,
                "phone" => $phone,
                "fax" => $fax
            );

            array_push($suppliers_arr["records"], $supplier_item);
        }


        // include paging
        $total_rows = $supplier->count();
        $page_url = "{$home_url}supplier/read_paging.php?";
        $paging = $utilities->getPaging($page, $total_rows, $records_per_page, $page_url);
        $suppliers_arr["paging"] = $paging;

        // set response code - 200 OK
        http_response_code(200);

        // make it json format
        echo json_encode($suppliers_arr);
    } else {

        // set response code - 404 Not found
        http_response_code(404);

        // tell the user suppliers does not exist
        echo json_encode(
            array("message" => "No suppliers found.")
        );
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}