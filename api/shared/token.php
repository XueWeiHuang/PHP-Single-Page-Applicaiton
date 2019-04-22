<?php
// required to decode jwt
include_once '../config/core.php';
include_once '../libs/php-jwt-master/src/BeforeValidException.php';
include_once '../libs/php-jwt-master/src/ExpiredException.php';
include_once '../libs/php-jwt-master/src/SignatureInvalidException.php';
include_once '../libs/php-jwt-master/src/JWT.php';
use \Firebase\JWT\JWT;

class Token
{
    // variables used for jwt
    private $key = "example_key"; // $key's value must be your own and unique secret key
    private $iss = "http://example.org"; // iss (issuer) claim identifies the principal that issued the JWT
    private $aud = "http://example.com"; // aud (audience) claim identifies the recipients that the JWT is intended for
    private $iat = 1356999524; // iat (issued at) claim identifies the time at which the JWT was issued
    private $nbf = 1357000000; // exp (expiration time) which identifies the expiration time on or after which the JWT MUST NOT be accepted for processing

    public function validate($jwt){
        if($jwt){
            // if decode succeed, show user details
            try {
                // decode jwt
                $decoded = JWT::decode($jwt, $this->key, array('HS256'));
                return $decoded->data;
            }
                // if decode fails, it means jwt is invalid
            catch (Exception $e){
                return false;
            }
        }
        else{
            return false;
        }
    }

    public function generate($data){
        if ($data){
            $token = array(
                "iss" => $this->iss,
                "aud" => $this->aud,
                "iat" => $this->iat,
                "nbf" => $this->nbf,
                "data" => $data
            );
            try{
                $jwt = JWT::encode($token, $this->key);
                return $jwt;
            }
            catch (Exception $e){
                return false;
            }
        }
        else{
            return false;
        }
    }
}