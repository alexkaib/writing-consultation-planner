<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require 'db_connection.php';
require 'config.php';
require 'vendor/autoload.php';
use \Firebase\JWT\JWT;

$data = json_decode(file_get_contents("php://input"));

if(isset($data->username)
    && isset($data->password)
    && !empty(trim($data->username))
    && !empty(trim($data->password))
  ){
    $username = mysqli_real_escape_string($db_conn, trim($data->username));
    $pw_given = trim($data->password);
    $stmt = $db_conn->prepare("SELECT `password`, `ptId`, `email`, `role`
      FROM `peerTutors` WHERE `email` = ? AND active=1");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $checkUser = $stmt->get_result();
    if (mysqli_num_rows($checkUser) > 0) {
      $user = mysqli_fetch_assoc($checkUser);
      if (password_verify($pw_given, $user['password'])) {

        $issuedAt = time();
        $notBefore = $issuedAt;
        $expire = $notBefore + 7200;

        $token = [
          'iat'  => $issuedAt,         // Issued at: time when the token was generated
          'nbf'  => $notBefore,        // Not before
          'exp'  => $expire,           // Expire
          'data' => [                  // Data related to the signer user
              'userId'   => $user['ptId'], // userid from the users table
              'userName' => $user['email'], // User name
              'userRole' => $user['role']
              ]
            ];

        $jwt = JWT::encode($token, $secret_key);
        echo json_encode(["success"=>1,"msg"=>"Erfolgreich validiert.", "access_token"=>$jwt]);
      }
      else {
        echo json_encode(["success"=>0,"msg"=>"Passwort und Benutzername stimmen nicht überein."]);
      }
    }
    else {
      echo json_encode(["success"=>0,"msg"=>"Passwort und Benutzername stimmen nicht überein."]);
    }
}
else {
  echo json_encode(["success"=>0,"msg"=>"Es wurden nicht alle Felder ausgefüllt."]);
}
