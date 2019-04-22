<?php
/**
 * Created by PhpStorm.
 * User: bernardojunqueira
 * Date: 10/22/2018
 * Time: 10:45 PM
 */

class Employee
{
    // database connection and table name
    private $conn;
    private $table_name = "emp";

    // object properties
    public $empid;
    public $lastname;
    public $firstname;
    public $title;
    public $titleofcourtesy;
    public $birthdate;
    public $hiredate;
    public $address;
    public $city;
    public $region;
    public $postalcode;
    public $country;
    public $phone;
    public $mgrid;

    // constructor with $db as database connection
    public function __construct($db){
        $this->conn = $db;
    }

    // create employee
    function create(){

        // query to insert record
        $query = "INSERT INTO
                " . $this->table_name . "
            SET
                lastname=:lastname, 
                firstname=:firstname,
                title=:title,
                titleofcourtesy=:titleofcourtesy, 
                birthdate=:birthdate,
                hiredate=:hiredate,
                address=:address,
                city=:city,
                region=:region,
                postalcode=:postalcode,
                country=:country,
                phone=:phone,
                mgrid=:mgrid";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastname=htmlspecialchars(strip_tags($this->lastname));
        $this->firstname=htmlspecialchars(strip_tags($this->firstname));
        $this->title=htmlspecialchars(strip_tags($this->title));
        $this->titleofcourtesy=htmlspecialchars(strip_tags($this->titleofcourtesy));
        $this->birthdate=htmlspecialchars(strip_tags($this->birthdate));
        $this->hiredate=htmlspecialchars(strip_tags($this->hiredate));
        $this->address=htmlspecialchars(strip_tags($this->address));
        $this->city=htmlspecialchars(strip_tags($this->city));
        $this->region=htmlspecialchars(strip_tags($this->region));
        $this->postalcode=htmlspecialchars(strip_tags($this->postalcode));
        $this->country=htmlspecialchars(strip_tags($this->country));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->mgrid=htmlspecialchars(strip_tags($this->mgrid));

        // bind values
        $stmt->bindParam(":lastname", $this->lastname);
        $stmt->bindParam(":firstname", $this->firstname);
        $stmt->bindParam(":title", $this->title);
        $stmt->bindParam(":titleofcourtesy", $this->titleofcourtesy);
        $stmt->bindParam(":birthdate", $this->birthdate);
        $stmt->bindParam(":hiredate", $this->hiredate);
        $stmt->bindParam(":address", $this->address);
        $stmt->bindParam(":city", $this->city);
        $stmt->bindParam(":region", $this->region);
        $stmt->bindParam(":postalcode", $this->postalcode);
        $stmt->bindParam(":country", $this->country);
        $stmt->bindParam(":phone", $this->phone);
        $stmt->bindParam(":mgrid", $this->mgrid);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // read employees
    function read(){

        // select all query
        $query = "SELECT
                e.empid,
                CONCAT(e.firstname, ' ', e.lastname) AS name,
                e.title,
                e.phone,
                CONCAT(m.firstname, ' ', m.lastname) AS manager
            FROM
                " . $this->table_name . " e
                LEFT JOIN
                    " . $this->table_name . " m
                        ON m.empid = e.mgrid
            ORDER BY
                name, e.title";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // read employees names
    function readNames(){

        // select all query
        $query = "SELECT
                empid,
                CONCAT(firstname, ' ', lastname) AS manager
            FROM
                " . $this->table_name . "
            ORDER BY
                manager";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // execute query
        $stmt->execute();

        return $stmt;
    }

    // used when filling up the update employee form
    function readOne(){

        // query to read single record
        $query = "SELECT
                empid,
                lastname,
                firstname,
                title,
                titleofcourtesy,
                birthdate,
                hiredate,
                address,
                city,
                region,
                postalcode,
                country,
                phone,
                mgrid
            FROM
                " . $this->table_name . "
            WHERE
                empid = ?
            LIMIT
                0,1";

        // prepare query statement
        $stmt = $this->conn->prepare( $query );

        // bind id of employee to be updated
        $stmt->bindParam(1, $this->empid);

        // execute query
        $stmt->execute();

        // get retrieved row
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // set values to object properties
        $this->lastname = $row['lastname'];
        $this->firstname = $row['firstname'];
        $this->title = $row['title'];
        $this->titleofcourtesy = $row['titleofcourtesy'];
        $this->birthdate = $row['birthdate'];
        $this->hiredate = $row['hiredate'];
        $this->address = $row['address'];
        $this->city = $row['city'];
        $this->region = $row['region'];
        $this->postalcode = $row['postalcode'];
        $this->country = $row['country'];
        $this->phone = $row['phone'];
        $this->mgrid = $row['mgrid'];
    }

    // read employees with pagination
    public function readPaging($from_record_num, $records_per_page){

        // select query
        $query = "SELECT
                e.empid,
                CONCAT(e.firstname, ' ', e.lastname) AS name,
                e.title,
                e.phone,
                CONCAT(m.firstname, ' ', m.lastname) AS manager
            FROM
                " . $this->table_name . " e
                LEFT JOIN
                    " . $this->table_name . " m
                        ON m.empid = e.mgrid
            ORDER BY
                name, e.title
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

    // update the employee
    function update(){

        // update query
        $query = "UPDATE
                " . $this->table_name . "
            SET
                lastname = :lastname,
                firstname = :firstname,
                title = :title,
                titleofcourtesy = :titleofcourtesy,
                birthdate = :birthdate,
                hiredate = :hiredate,
                address = :address,
                city = :city,
                region = :region,
                postalcode = :postalcode,
                country = :country,
                phone = :phone,
                mgrid = :mgrid
            WHERE
                empid = :empid";

        // prepare query statement
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->lastname=htmlspecialchars(strip_tags($this->lastname));
        $this->firstname=htmlspecialchars(strip_tags($this->firstname));
        $this->title=htmlspecialchars(strip_tags($this->title));
        $this->titleofcourtesy=htmlspecialchars(strip_tags($this->titleofcourtesy));
        $this->birthdate=htmlspecialchars(strip_tags($this->birthdate));
        $this->hiredate=htmlspecialchars(strip_tags($this->hiredate));
        $this->address=htmlspecialchars(strip_tags($this->address));
        $this->city=htmlspecialchars(strip_tags($this->city));
        $this->region=htmlspecialchars(strip_tags($this->region));
        $this->postalcode=htmlspecialchars(strip_tags($this->postalcode));
        $this->country=htmlspecialchars(strip_tags($this->country));
        $this->phone=htmlspecialchars(strip_tags($this->phone));
        $this->mgrid=htmlspecialchars(strip_tags($this->mgrid));

        // bind new values
        $stmt->bindParam(':lastname', $this->lastname);
        $stmt->bindParam(':firstname', $this->firstname);
        $stmt->bindParam(':title', $this->title);
        $stmt->bindParam(':titleofcourtesy', $this->titleofcourtesy);
        $stmt->bindParam(':birthdate', $this->birthdate);
        $stmt->bindParam(':hiredate', $this->hiredate);
        $stmt->bindParam(':address', $this->address);
        $stmt->bindParam(':city', $this->city);
        $stmt->bindParam(':region', $this->region);
        $stmt->bindParam(':postalcode', $this->postalcode);
        $stmt->bindParam(':country', $this->country);
        $stmt->bindParam(':phone', $this->phone);
        $stmt->bindParam(':mgrid', $this->mgrid);
        $stmt->bindParam(':empid', $this->empid);

        // execute the query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // delete the employee
    function delete(){

        // delete query
        $query = "DELETE FROM " . $this->table_name . " WHERE empid = ?";

        // prepare query
        $stmt = $this->conn->prepare($query);

        // sanitize
        $this->empid=htmlspecialchars(strip_tags($this->empid));

        // bind id of record to delete
        $stmt->bindParam(1, $this->empid);

        // execute query
        if($stmt->execute()){
            return true;
        }

        return false;
    }

    // search employees
    function search($keywords){

        // select all query
        $query = "SELECT
                e.empid,
                CONCAT(e.firstname, ' ', e.lastname) AS name,
                e.title,
                e.phone,
                CONCAT(m.firstname, ' ', m.lastname) AS manager
            FROM
                " . $this->table_name . " e
                LEFT JOIN
                    " . $this->table_name . " m
                        ON m.empid = e.mgrid
            WHERE
                CONCAT(e.firstname, ' ', e.lastname) LIKE ? 
                    OR e.title LIKE ? 
                    OR CONCAT(m.firstname, ' ', m.lastname) LIKE ?
            ORDER BY
                name, e.title";

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

    // used for paging employees
    public function count(){
        $query = "SELECT COUNT(*) as total_rows FROM " . $this->table_name ;

        $stmt = $this->conn->prepare( $query );
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row['total_rows'];
    }
}