<?php
/**
 * Created by PhpStorm.
 * User: bernardojunqueira
 * Date: 11/16/2018
 * Time: 9:19 AM
 */

class Shipper
{
// database connection and table name
    private $conn;
    private $table_name = "ship";

    // object properties
    public $shipperid;
    public $companyname;
    public $phone;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create category
    function create(){

        // query to insert record
        $query = "INSERT INTO
                " . $this->table_name . "
            SET
                companyname=:companyname, phone=:phone";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->companyname=htmlspecialchars(strip_tags($this->companyname));
        $this->phone=htmlspecialchars(strip_tags($this->phone));

        // bind values
        $stmt->bindParam(":companyname", $this->companyname);
        $stmt->bindParam(":phone", $this->phone);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // read categories
    function read(){

        // select all query
        $query = "SELECT shipperid, companyname, phone    
            FROM
                " . $this->table_name . " 
            ORDER BY
                companyname";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // used when filling up the update category form
    function readOne(){

        // query to read single record
        $query = "SELECT
                shipperid, companyname, phone
            FROM
                " . $this->table_name . "
            WHERE
                shipperid = ?
            LIMIT
                0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of category to be updated
        $stmt->bindParam(1, $this->shipperid);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->companyname = $row['companyname'];
        $this->phone = $row['phone'];
    }

    // read categories with pagination
    public function readPaging($from_record_num, $records_per_page){

        // select query
        $query = "SELECT shipperid, companyname, phone    
            FROM
                " . $this->table_name . " 
            ORDER BY
                companyname
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

    // update the category
    function update(){

        // update query
        $query = "UPDATE
                " . $this->table_name . "
            SET
                companyname = :companyname,
                phone = :phone
            WHERE
                shipperid = :shipperid";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->companyname=htmlspecialchars(strip_tags($this->companyname));
        $this->phone=htmlspecialchars(strip_tags($this->phone));

        // bind new values
        $stmt->bindParam(':companyname', $this->companyname);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':shipperid', $this->shipperid);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // delete the category
    function delete(){

        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE shipperid = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->shipperid=htmlspecialchars(strip_tags($this->shipperid));

        // bind id of record to delete
        $stmt->bindParam(1, $this->shipperid);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // search categories
    function search($keywords){

        // select all query
        $query = "SELECT
                shipperid, companyname, phone
            FROM
                " . $this->table_name . "
            WHERE
                companyname LIKE ?
            ORDER BY
                companyname";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // bind
        $stmt->bindParam(1, $keywords);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // used for paging categories
    public function count(){
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name ;

        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }
}