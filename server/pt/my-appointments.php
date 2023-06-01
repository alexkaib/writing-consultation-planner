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

        // Access is granted.
        $data_array = (array) $decoded_array['data'];
        $user_id = $data_array['userId'];
        // only get posted slots starting this week's monday
        $this_monday = strtotime('monday this week');
        $this_monday = date("Y-m-d", $this_monday);

        $pt_appointments = mysqli_query($db_conn, "SELECT * FROM `termine`
          WHERE `tutorId` = '$user_id'
          AND `datum` >= '$this_monday'");

        if ($pt_appointments) {
          $res = mysqli_fetch_all($pt_appointments, MYSQLI_ASSOC);
          echo json_encode(array(
              "success" => 1,
              "pt_appointments" => $res,
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
