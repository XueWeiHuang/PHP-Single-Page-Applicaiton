<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// include database and object files
include_once '../config/database.php';
include_once '../objects/order.php';
include_once '../objects/orderDetail.php';
include_once '../shared/token.php';

// json web token
$token = new Token();

// authorize user with jwt
if(isset(apache_request_headers()['Authorization']) and $token->validate((apache_request_headers()['Authorization']))){

    // instantiate database and category object
    $database = new Database();
    $db = $database->getConnection();
    $order = new Order($db);

    // get posted data
    $data = json_decode(file_get_contents("php://input"));

    // make sure data is not empty
    if(
        !empty($data->custid) &&
        !empty($data->empid) &&
        !empty($data->orderdate) &&
        !empty($data->requireddate) &&
        !empty($data->shippeddate) &&
        !empty($data->details)
    ){

        // set order property values
        $order->custid = $data->custid;
        $order->empid = $data->empid;
        $order->orderdate = $data->orderdate;
        $order->requireddate = $data->requireddate;
        $order->shippeddate = $data->shippeddate;
        $order->shipperid = 1;
        $order->freight = 0;
        $order->shipname = $data->shipname;
        $order->shipaddress = $data->shipaddress;
        $order->shipcity = $data->shipcity;
        $order->shipregion = $data->shipregion;
        $order->shippostalcode = $data->shippostalcode;
        $order->shipcountry = $data->shipcountry;

        foreach ($data->details as $detail){
            $orderdetail = new OrderDetail();
            $orderdetail->productid = $detail->productid;
            $orderdetail->unitprice = $detail->unitprice;
            $orderdetail->qty = $detail->qty;
            $orderdetail->discount = $detail->discount;
            array_push($order->details, $orderdetail);
        }

        // create the order
        if($order->create()){

            // set response code - 201 created
            http_response_code(201);

            // tell the user
            echo json_encode(array("message" => "Order was created."));
        }

        // if unable to create the order, tell the user
        else{

            // set response code - 503 service unavailable
            http_response_code(503);

            // tell the user
            echo json_encode(array("message" => "Unable to create order."));
        }
    }

    // tell the user data is incomplete
    else{

        // set response code - 400 bad request
        http_response_code(400);

        // tell the user
        echo json_encode(array("message" => "Unable to create order. Data is incomplete."));
    }

} else {

    // set response code
    http_response_code(401);

    // tell the user access denied
    echo json_encode(array("message" => "Access denied."));
}