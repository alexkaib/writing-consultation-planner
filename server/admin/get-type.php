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

    $sql = "SELECT name_de, name_en, audience, info_de, info_en, min_date,
              max_date, send_cal_invite, confirmation_mail, eval_mail
            FROM consultationTypes WHERE active=1 AND id=?";

    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("i", $post_data->typeId);
    $stmt->execute();

    $res = $stmt->get_result();
    $typeInfo = $res->fetch_assoc();

    if (isset($typeInfo)) {
      echo json_encode([
          "success" => 1,
          "typeInfo" => $typeInfo,
      ]);
    } else {
      echo json_encode([
          "success" => 0,
          "msg" => "Datenbankabfrage nicht erfolgreich."
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
