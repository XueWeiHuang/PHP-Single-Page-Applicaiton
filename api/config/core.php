<?php
// show error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// home page url
$home_url="http://localhost/api/";

// page given in URL parameter, default page is one
$page = isset($_GET['page']) ? $_GET['page'] : 1;

// set number of records per page
$records_per_page = 5;

// calculate for the query LIMIT clause
$from_record_num = ($records_per_page * $page) - $records_per_page;

// set your default time-zone
date_default_timezone_set('America/Toronto');

// variables used for jwt
$key = "example_key"; // $key's value must be your own and unique secret key
$iss = "http://example.org"; // iss (issuer) claim identifies the principal that issued the JWT
$aud = "http://example.com"; // aud (audience) claim identifies the recipients that the JWT is intended for
$iat = 1356999524; // iat (issued at) claim identifies the time at which the JWT was issued
$nbf = 1357000000; // exp (expiration time) which identifies the expiration time on or after which the JWT MUST NOT be accepted for processing