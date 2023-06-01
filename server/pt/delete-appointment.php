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

        // Access is granted.
        $data_array = (array) $decoded_array['data'];
        $user_id = $data_array['userId'];

        $post_data = json_decode(file_get_contents("php://input"));

        if (isset($post_data->terminId)) {

          $terminId = $post_data->terminId;

          // delete termin from db and set previous conference's follow-up-id to null
          $deleteSlot = mysqli_query($db_conn, "DELETE FROM `termine` WHERE `terminId`='$terminId'");
          $resetFollowUp = mysqli_query($db_conn, "UPDATE `termine` SET `followUpId` = NULL WHERE `followUpId`='$terminId'");

          // check if RS data associated with termin can be deleted
          if (isset($post_data->rsId)) {
            $rsId = $post_data->rsId;
            $otherConsultationsWithSameRS = mysqli_query($db_conn, "SELECT terminId FROM termine WHERE rsId='$rsId'");
            if (mysqli_num_rows($otherConsultationsWithSameRS) > 0) {
              $deleteRS = mysqli_query($db_conn, "DELETE FROM `ratsuchende` WHERE `rsId`='$post_data->rsId'");
            }
          }

          if($deleteSlot){
            echo json_encode(["success"=>1, "msg"=>"Termin gelöscht"]);
          }
          else {
            echo json_encode(["success"=>0, "msg"=>"Der Termin wurde nicht gefunden"]);
          }
        }
        else {
          echo json_encode(["success"=>0, "msg"=>"Keine Termin-Daten empfangen"]);
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
