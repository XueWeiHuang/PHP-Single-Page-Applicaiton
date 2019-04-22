<?php

class Supplier
{
    // database connection and table name
    private $conn;
    private $table_name = "sup";

    // object properties
    public $supplierid;
    public $companyname;
    public $contactname;
    public $contacttitle;
    public $address;
    public $city;
    public $region;
    public $postalcode;
    public $country;
    public $phone;
    public $fax;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create supplier
    function create(){

        // query to insert record
        $query = "INSERT INTO
                " . $this->table_name . "
            SET
                companyname=:companyname, 
                contactname=:contactname,
                contacttitle=:contacttitle,
                address=:address,
                city=:city,
                region=:region,
                postalcode=:postalcode,
                country=:country,
                phone=:phone,
                fax=:fax";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->companyname=htmlspecialchars(strip_tags($this->companyname));
        $this->contactname=htmlspecialchars(strip_tags($this->contactname));
        $this->contacttitle=htmlspecialchars(strip_tags($this->contacttitle));
        $this->address=htmlspecialchars(strip_tags($this->address));
        $this->city=htmlspecialchars(strip_tags($this->city));
        $this->region=htmlspecialchars(strip_tags($this->region));
        $this->postalcode=htmlspecialchars(strip_tags($this->postalcode));
        $this->country=htmlspecialchars(strip_tags($this->country));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->fax=htmlspecialchars(strip_tags($this->fax));

        // bind values
        $stmt->bindParam(":companyname", $this->companyname);
        $stmt->bindParam(":contactname", $this->contactname);
        $stmt->bindParam(":contacttitle", $this->contacttitle);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":region", $this->region);
        $stmt->bindParam(":postalcode", $this->postalcode);
        $stmt->bindParam(":country", $this->country);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":fax", $this->fax);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // read suppliers
    function read(){

        // select all query
        $query = "SELECT 
                supplierid, 
                companyname, 
                contactname, 
                contacttitle, 
                phone, 
                fax     
            FROM
                " . $this->table_name . " 
            ORDER BY
                companyname, contactname";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // used when filling up the update supplier form
    function readOne(){

        // query to read single record
        $query = "SELECT
                supplierid,
                companyname,
                contactname,
                contacttitle,
                address,
                city,
                region,
                postalcode,
                country,
                phone,
                fax
            FROM
                " . $this->table_name . "
            WHERE
                supplierid = ?
            LIMIT
                0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of supplier to be updated
        $stmt->bindParam(1, $this->supplierid);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->companyname = $row['companyname'];
        $this->contactname = $row['contactname'];
        $this->contacttitle = $row['contacttitle'];
        $this->address = $row['address'];
        $this->city = $row['city'];
        $this->region = $row['region'];
        $this->postalcode = $row['postalcode'];
        $this->country = $row['country'];
        $this->phone = $row['phone'];
        $this->fax = $row['fax'];
    }

    // read suppliers with pagination
    public function readPaging($from_record_num, $records_per_page){

        // select query
        $query = "SELECT 
                supplierid, 
                companyname, 
                contactname, 
                contacttitle, 
                phone, 
                fax     
            FROM
                " . $this->table_name . " 
            ORDER BY
                companyname, contactname
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

    // update the supplier
    function update(){

        // update query
        $query = "UPDATE
                " . $this->table_name . "
            SET
                companyname = :companyname,
                contactname = :contactname,
                contacttitle = :contacttitle,
                address = :address,
                city = :city,
                region = :region,
                postalcode = :postalcode,
                country = :country,
                phone = :phone,
                fax = :fax
            WHERE
                supplierid = :supplierid";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->companyname=htmlspecialchars(strip_tags($this->companyname));
        $this->contactname=htmlspecialchars(strip_tags($this->contactname));
        $this->contacttitle=htmlspecialchars(strip_tags($this->contacttitle));
        $this->address=htmlspecialchars(strip_tags($this->address));
        $this->city=htmlspecialchars(strip_tags($this->city));
        $this->region=htmlspecialchars(strip_tags($this->region));
        $this->postalcode=htmlspecialchars(strip_tags($this->postalcode));
        $this->country=htmlspecialchars(strip_tags($this->country));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->fax=htmlspecialchars(strip_tags($this->fax));

        // bind new values
        $stmt->bindParam(':companyname', $this->companyname);
        $stmt->bindParam(':contactname', $this->contactname);
        $stmt->bindParam(':contacttitle', $this->contacttitle);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':city', $this->city);
        $stmt->bindParam(':region', $this->region);
        $stmt->bindParam(':postalcode', $this->postalcode);
        $stmt->bindParam(':country', $this->country);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':fax', $this->fax);
        $stmt->bindParam(':supplierid', $this->supplierid);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // delete the supplier
    function delete(){

        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE supplierid = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->supplierid=htmlspecialchars(strip_tags($this->supplierid));

        // bind id of record to delete
        $stmt->bindParam(1, $this->supplierid);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // search suppliers
    function search($keywords){

        // select all query
        $query = "SELECT 
                supplierid, 
                companyname, 
                contactname, 
                contacttitle, 
                phone, 
                fax
            FROM
                " . $this->table_name . "
            WHERE
                companyname LIKE ? OR contactname LIKE ?
            ORDER BY
                companyname, contactname";

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

    // used for paging suppliers
    public function count(){
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name ;

        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }
}