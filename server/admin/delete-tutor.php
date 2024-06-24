<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../db_connection.php';
require '../config.php';
require "../vendor/autoload.php";
use \Firebase\JWT\JWT;

$post_data = json_decode(file_get_contents("php://input"));

if (isset($post_data->jwt)) {
  $jwt = $post_data->jwt;
  try {

    $decoded = JWT::decode($jwt, $secret_key, array('HS256'));
    $decoded_array = (array) $decoded;
    $data_array = (array) $decoded_array['data'];
    $user_id = $data_array['userId'];
    $user_role = $data_array['userRole'];

    if ($user_role !== 'admin') {
      echo json_encode([
          "success" => 0,
          "msg" => "Access denied."
      ]);
      die();
    }

    $tutor_id= $post_data->tutorId;

    $sql = "UPDATE peerTutors SET active=0, firstName='archived', lastName='archived',
            email='archived', subjects='archived', role='archived', mailText='archived'
            WHERE ptId=?";

    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("i", $tutor_id);
    $stmt->execute();

    if (!($stmt->error)) {
      echo json_encode([
          "success" => 1,
          "msg" => "Tutor archive successful",
      ]);
    } else {
      echo json_encode([
          "success" => 0,
          "msg" => "$stmt->error"
      ]);
    }
  }
catch (Exception $e){

  http_response_code(401);

  echo json_encode(array(
      "message" => "Access denied.",
      "error" => $e->getMessage()
  ));
}}
else {
  echo json_encode(["success"=>0, "msg" => "Keine Zugangsdaten gefunden. Bitte melde dich erneut an."]);
}
?>
