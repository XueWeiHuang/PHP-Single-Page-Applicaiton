<?php

class Product
{
    // database connection and table name
    private $conn;
    private $table_name = "prod";

    // object properties
    public $productid;
    public $productname;
    public $supplierid;
    public $categoryid;
    public $unitprice;
    public $discontinued;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create product
    function create(){

        // query to insert record
        $query = "INSERT INTO
                " . $this->table_name . "
            SET
                productname=:productname, 
                supplierid=:supplierid,
                categoryid=:categoryid,
                unitprice=:unitprice,
                discontinued=:discontinued";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->productname=htmlspecialchars(strip_tags($this->productname));
        $this->supplierid=htmlspecialchars(strip_tags($this->supplierid));
        $this->categoryid=htmlspecialchars(strip_tags($this->categoryid));
        $this->unitprice=htmlspecialchars(strip_tags($this->unitprice));
        $this->discontinued=htmlspecialchars(strip_tags($this->discontinued));

        // bind values
        $stmt->bindParam(":productname", $this->productname);
        $stmt->bindParam(":supplierid", $this->supplierid);
        $stmt->bindParam(":categoryid", $this->categoryid);
        $stmt->bindParam(":unitprice", $this->unitprice);
        $stmt->bindParam(":discontinued", $this->discontinued);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // read all products
    function read(){

        // select all query
        $query = "
          SELECT
            p.productid,
            p.productname,
            s.companyname,
            c.categoryname,
            p.unitprice,
            p.discontinued
          FROM " . $this->table_name . " p
            INNER JOIN cat c ON c.categoryid = p.categoryid
            INNER JOIN sup s ON s.supplierid = p.supplierid
          ORDER BY p.productname, s.companyname, c.categoryname";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read product by id
    function readOne(){

        // query to read single record
        $query = "SELECT
                productid,
                productname,
                supplierid,
                categoryid,
                unitprice,
                discontinued       
            FROM
                " . $this->table_name . "
            WHERE
                productid = ?
            LIMIT
                0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of employee to be updated
        $stmt->bindParam(1, $this->productid);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->productname = $row['productname'];
        $this->supplierid = $row['supplierid'];
        $this->categoryid = $row['categoryid'];
        $this->unitprice = $row['unitprice'];
        $this->discontinued = $row['discontinued'];
    }

    // read all products with pagination
    public function readPaging($from_record_num, $records_per_page){

        // select all query with paging
        $query = "
          SELECT
            p.productid,
            p.productname,
            s.companyname,
            c.categoryname,
            p.unitprice,
            p.discontinued
          FROM " . $this->table_name . " p
            INNER JOIN cat c ON c.categoryid = p.categoryid
            INNER JOIN sup s ON s.supplierid = p.supplierid
          ORDER BY p.productname, s.companyname, c.categoryname
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

    // update product by id
    function update(){

        // update query
        $query = "UPDATE
                " . $this->table_name . "
            SET
                productname = :productname,
                supplierid = :supplierid,
                categoryid = :categoryid,
                unitprice = :unitprice,
                discontinued = :discontinued
            WHERE
                productid = :productid";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->productname=htmlspecialchars(strip_tags($this->productname));
        $this->supplierid=htmlspecialchars(strip_tags($this->supplierid));
        $this->categoryid=htmlspecialchars(strip_tags($this->categoryid));
        $this->unitprice=htmlspecialchars(strip_tags($this->unitprice));
        $this->discontinued=htmlspecialchars(strip_tags($this->discontinued));


        // bind new values
        $stmt->bindParam(':productname', $this->productname);
        $stmt->bindParam(':supplierid', $this->supplierid);
        $stmt->bindParam(':categoryid', $this->categoryid);
        $stmt->bindParam(':unitprice', $this->unitprice);
        $stmt->bindParam(':discontinued', $this->discontinued);
        $stmt->bindParam(':productid', $this->productid);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // delete product by id
    function delete(){

        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE productid = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->productid=htmlspecialchars(strip_tags($this->productid));

        // bind id of record to delete
        $stmt->bindParam(1, $this->productid);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // search products
    function search($keywords){

        // select all query
        $query = "
          SELECT
            p.productid,
            p.productname,
            s.companyname,
            c.categoryname,
            p.unitprice,
            p.discontinued
          FROM " . $this->table_name . " p
            INNER JOIN cat c ON c.categoryid = p.categoryid
            INNER JOIN sup s ON s.supplierid = p.supplierid
          WHERE 
            p.productname LIKE ? OR 
            s.companyname LIKE ? OR 
            c.categoryname LIKE ?
          ORDER BY p.productname, s.companyname, c.categoryname";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // bind
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);
        $stmt->bindParam(3, $keywords);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // used for paging products
    public function count(){
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name ;

        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }
}