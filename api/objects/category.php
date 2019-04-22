<?php

class Category
{
    // database connection and table name
    private $conn;
    private $table_name = "cat";

    // object properties
    public $categoryid;
    public $categoryname;
    public $description;

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
                categoryname=:categoryname, description=:description";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->categoryname=htmlspecialchars(strip_tags($this->categoryname));
        $this->description=htmlspecialchars(strip_tags($this->description));

        // bind values
        $stmt->bindParam(":categoryname", $this->categoryname);
        $stmt->bindParam(":description", $this->description);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // read categories
    function read(){

        // select all query
        $query = "SELECT categoryid, categoryname, description    
            FROM
                " . $this->table_name . " 
            ORDER BY
                categoryname";

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
                categoryid, categoryname, description
            FROM
                " . $this->table_name . "
            WHERE
                categoryid = ?
            LIMIT
                0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of category to be updated
        $stmt->bindParam(1, $this->categoryid);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->categoryname = $row['categoryname'];
        $this->description = $row['description'];
    }

    // read categories with pagination
    public function readPaging($from_record_num, $records_per_page){

        // select query
        $query = "SELECT categoryid, categoryname, description    
            FROM
                " . $this->table_name . " 
            ORDER BY
                categoryname
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
                categoryname = :categoryname,
                description = :description
            WHERE
                categoryid = :categoryid";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->categoryname=htmlspecialchars(strip_tags($this->categoryname));
        $this->description=htmlspecialchars(strip_tags($this->description));

        // bind new values
        $stmt->bindParam(':categoryname', $this->categoryname);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':categoryid', $this->categoryid);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // delete the category
    function delete(){

        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE categoryid = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->categoryid=htmlspecialchars(strip_tags($this->categoryid));

        // bind id of record to delete
        $stmt->bindParam(1, $this->categoryid);

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
                categoryid, categoryname, description
            FROM
                " . $this->table_name . "
            WHERE
                categoryname LIKE ? OR description LIKE ?
            ORDER BY
                categoryname";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $keywords=htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        // bind
        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);

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