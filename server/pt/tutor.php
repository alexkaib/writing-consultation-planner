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

        // Access is granted.
        $data_array = (array) $decoded_array['data'];
        $user_id = $data_array['userId'];

        $user_info = mysqli_query($db_conn, "SELECT `firstName`, `lastName`, `subjects`, `role` FROM `peerTutors` WHERE `ptId` = '$user_id'");
        $row = mysqli_fetch_assoc($user_info);


        echo json_encode(array(
            "message" => "Access granted",
            "logged_in_tutor_id" => $user_id,
            "logged_in_tutor_name" => $row['firstName'],
            "logged_in_tutor_role" => $row['role']
        ));

    }catch (Exception $e){

    http_response_code(401);

    echo json_encode(array(
        "message" => "Access denied.",
        "error" => $e->getMessage()
    ));
}
}
