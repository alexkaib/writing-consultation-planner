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

        if (isset($post_data->rsId)) {

          $rsId = $post_data->rsId;
          $get_rs = mysqli_query($db_conn, "SELECT * FROM `ratsuchende` WHERE `rsId`='$rsId'");

          if(mysqli_num_rows($get_rs) > 0){
            $rs_info = mysqli_fetch_assoc($get_rs);

            // get consultation type info
            $booked_type_id = $rs_info['bookedTypeId'];
            $get_type = mysqli_query($db_conn, "SELECT name_de, name_en FROM `consultationTypes` WHERE `id`='$booked_type_id'");
            $type_info = mysqli_fetch_assoc($get_type);

            echo json_encode(["success"=>1, "rsInfo"=>$rs_info, "typeInfo"=>$type_info]);
          }
          else {
            echo json_encode(["success"=>0, "msg"=>"Die Ratsuchende wurde nicht gefunden"]);
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
