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

        //$registrations = mysqli_query($db_conn, "SELECT * FROM `termine` WHERE `tutorId` = '$user_id' AND `available` = 0 AND `archived` = 0");
        $registration_query = mysqli_query($db_conn, "SELECT t.*, rs.first_name, rs.last_name, rs.email  FROM termine t
                                                  INNER JOIN ratsuchende rs ON (rs.rsId = t.rsId)
                                                  WHERE `tutorId` = '$user_id' AND `available` = 0 AND `archived` = 0");

        $tutor_query = mysqli_query($db_conn, "SELECT `ptId`, `firstName`, `lastName` FROM `peerTutors` WHERE active=1");

        if ($registration_query && $tutor_query) {
          $tutors = mysqli_fetch_all($tutor_query, MYSQLI_ASSOC);
          $registrations = mysqli_fetch_all($registration_query, MYSQLI_ASSOC);
          echo json_encode(array(
              "success" => 1,
              "registrations" => $registrations,
              "tutors" => $tutors
          ));
        } else {
          echo json_encode(array(
              "success" => 0,
              "msg" => "Datenbankabfrage nicht erfolgreich."
            ));
        }

    }catch (Exception $e){

    http_response_code(401);

    echo json_encode(array(
        "message" => "Access denied.",
        "error" => $e->getMessage()
    ));
}
}
else {
  echo json_encode(["success"=>0, "msg" => "Keine Zugangsdaten gefunden. Bitte melde dich erneut an."]);
}
