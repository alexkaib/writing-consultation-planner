<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Headers, Authorization, X-Requested-With");

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

        if (isset($post_data->terminId) && isset($post_data->tutorId)) {

          $terminId = $post_data->terminId;
          $tutorId = $post_data->tutorId;

          $updateAppointment = mysqli_query($db_conn,
            "UPDATE `termine` SET `tutorId`='$tutorId' WHERE `terminId`='$terminId'"
          );

          if($updateAppointment){
            echo json_encode(["success"=>1, "msg"=>"Die Beratung wurde erfolgreich übertragen."]);
          }
          else {
            echo json_encode(["success"=>0, "msg"=>"Die Beratung konnte nicht übertragen werden."]);
          }
        }
        else {
          echo json_encode(["success"=>0, "msg"=>"Keine Daten empfangen"]);
        }

    }catch (Exception $e){

    http_response_code(401);

    echo json_encode(array(
        "msg" => "Zugangsdaten sind abgelaufen. Bitte melde dich erneut an.",
        "error" => $e->getMessage()
    ));
}
}
 ?>
