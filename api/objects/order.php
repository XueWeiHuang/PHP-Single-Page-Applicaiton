<?php
/**
 * Created by PhpStorm.
 * User: bernardojunqueira
 * Date: 11/12/2018
 * Time: 8:30 PM
 */

class Order
{
    // database connection and table name
    private $conn;
    private $table_name = "ord";

    // object properties
    public $orderid;
    public $custid;
    public $empid;
    public $orderdate;
    public $requireddate;
    public $shippeddate;
    public $shipperid;
    public $freight;
    public $shipname;
    public $shipaddress;
    public $shipcity;
    public $shipregion;
    public $shippostalcode;
    public $shipcountry;
    public $orderdetails;
    public $details = array();

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create order
    function create(){

        // query to insert record
        $query = "INSERT INTO
                " . $this->table_name . "
            SET
                custid=:custid, 
                empid=:empid,
                orderdate=:orderdate,
                requireddate=:requireddate,
                shippeddate=:shippeddate,
                shipperid=:shipperid,
                freight=:freight,
                shipname=:shipname,
                shipaddress=:shipaddress,
                shipcity=:shipcity,
                shipregion=:shipregion,
                shippostalcode=:shippostalcode,
                shipcountry=:shipcountry";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->custid=htmlspecialchars(strip_tags($this->custid));
        $this->empid=htmlspecialchars(strip_tags($this->empid));
        $this->orderdate=htmlspecialchars(strip_tags($this->orderdate));
        $this->requireddate=htmlspecialchars(strip_tags($this->requireddate));
        $this->shippeddate=htmlspecialchars(strip_tags($this->shippeddate));
        $this->shipperid=htmlspecialchars(strip_tags($this->shipperid));
        $this->freight=htmlspecialchars(strip_tags($this->freight));
        $this->shipname=htmlspecialchars(strip_tags($this->shipname));
        $this->shipaddress=htmlspecialchars(strip_tags($this->shipaddress));
        $this->shipcity=htmlspecialchars(strip_tags($this->shipcity));
        $this->shipregion=htmlspecialchars(strip_tags($this->shipregion));
        $this->shippostalcode=htmlspecialchars(strip_tags($this->shippostalcode));
        $this->shipcountry=htmlspecialchars(strip_tags($this->shipcountry));

        // bind values
        $stmt->bindParam(":custid", $this->custid);
        $stmt->bindParam(":empid", $this->empid);
        $stmt->bindParam(":orderdate", $this->orderdate);
        $stmt->bindParam(":requireddate", $this->requireddate);
        $stmt->bindParam(":shippeddate", $this->shippeddate);
        $stmt->bindParam(":shipperid", $this->shipperid);
        $stmt->bindParam(":freight", $this->freight);
        $stmt->bindParam(":shipname", $this->shipname);
        $stmt->bindParam(":shipaddress", $this->shipaddress);
        $stmt->bindParam(":shipcity", $this->shipcity);
        $stmt->bindParam(":shipregion", $this->shipregion);
        $stmt->bindParam(":shippostalcode", $this->shippostalcode);
        $stmt->bindParam(":shipcountry", $this->shipcountry);

        // execute query
        if($stmt->execute()){
            // create order details
           $orderid = $this->conn->lastInsertId();

            return true;
        }

        return false;
    }

    // read all orders
    function read(){

        // select all query
        $query = "
          SELECT
            o.orderid,
            o.orderdate,
            o.requireddate,
            o.shippeddate,
            c.companyname AS customer,
            CONCAT(e.firstname, e.lastname) AS employee,
            s.companyname AS shipper
          FROM " . $this->table_name . " o
            INNER JOIN cust c ON c.custid = o.custid
            INNER JOIN emp e ON e.empid = o.empid
            INNER JOIN ship s ON s.shipperid = o.shipperid
          ORDER BY o.orderdate, customer, employee";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read all orders with pagination
    public function readPaging($from_record_num, $records_per_page){

        // select all query with paging
        $query = "
          SELECT
            o.orderid,
            o.orderdate,
            o.requireddate,
            o.shippeddate,
            c.companyname AS customer,
            CONCAT(e.firstname, e.lastname) AS employee,
            s.companyname AS shipper
          FROM " . $this->table_name . " o
            INNER JOIN cust c ON c.custid = o.custid
            INNER JOIN emp e ON e.empid = o.empid
            INNER JOIN ship s ON s.shipperid = o.shipperid
          ORDER BY o.orderdate, customer, employee 
          LIMIT ?, ?";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind variable values
        $stmt->bindParam(1, $from_record_num, PDO::PARAM_INT);
        $stmt->bindParam(2, $records_per_page, PDO::PARAM_INT);

        // execute query
        $stmt->execute();

        // return values from database
        return $stmt;
    }

    // used for paging orders
    public function count(){
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name ;

        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }
}