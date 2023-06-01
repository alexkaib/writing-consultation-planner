<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: GET");
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

        $terminId = $post_data->terminId;
        $terminDate = $post_data->terminDate;
        $terminTime = $post_data->terminTime;

        $other_appointments_query = mysqli_query(
          $db_conn,
          "SELECT * FROM `termine` WHERE `datum` = '$terminDate' AND timeslot = '$terminTime'"
        );

        if ($other_appointments_query) {
          $available = TRUE;

          while($row = mysqli_fetch_assoc($other_appointments_query)) {
            if ($row['terminId'] === $terminId) continue;
            if ($row['roomReservation'] === '1') {
              $available = FALSE;
            }
          }

          echo json_encode(array(
              "success" => 1,
              "available" => $available
          ));
        } else {
          echo json_encode(array(
              "success" => 0,
              "msg" => "Datenbankabfrage nicht erfolgreich."
            ));
        }

    }catch (Exception $e){

    echo json_encode(array(
        "success" => 0,
        "msg" => "Zugangsdaten sind abgelaufen. Bitte melde dich erneut an.",
        "error" => $e->getMessage()
    ));
    }
}
else {
echo json_encode(["success"=>0, "msg" => "Keine Zugangsdaten gefunden. Bitte melde dich erneut an."]);
}
