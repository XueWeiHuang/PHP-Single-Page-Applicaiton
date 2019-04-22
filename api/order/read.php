<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// include database and object files
include_once '../config/database.php';
include_once '../objects/order.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if(isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))){

    // instantiate database and order object
    $database = new Database();
    $db = $database->getConnection();
    $order = new Order($db);

    // query order
    $stmt = $order->read();
    $num = $stmt->rowCount();

    // check if more than 0 record found
    if($num>0){

        // orders array
        $orders_arr=array();
        $orders_arr["records"]=array();

        // retrieve our table contents
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            // extract row
            // this will make $row['name'] to
            // just $name only
            extract($row);

            $order_item=array(
                "orderid" => $orderid,
                "orderdate" => date_format(date_create($orderdate),"Y/m/d"),
                "requireddate" => date_format(date_create($requireddate),"Y/m/d"),
                "shippeddate" => date_format(date_create($shippeddate),"Y/m/d"),
                "customer" => $customer,
                "employee" => $employee,
                "shipper" => $shipper
            );

            array_push($orders_arr["records"], $order_item);
        }

        // set response code - 200 OK
        http_response_code(200);

        // show orders data in json format
        echo json_encode($orders_arr);
    }
    else{

        // set response code - 404 Not found
        http_response_code(404);

        // tell the user no orders found
        echo json_encode(
            array("message" => "No orders found.")
        );
    }
} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}