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

        $post_data = json_decode(file_get_contents("php://input"));

        if (isset($post_data->terminId) && isset($post_data->rsId)) {
          $terminId = $post_data->terminId;
          $rsId = $post_data->rsId;
          // get rs email and their consultation type's eval mail text
          $sql = "SELECT rs.email, ct.eval_mail FROM ratsuchende rs
            INNER JOIN consultationTypes ct ON rs.bookedTypeId=ct.id WHERE rs.rsId='$rsId'";

          $res = mysqli_query($db_conn, $sql);
          $row = mysqli_fetch_assoc($res);
          $rs_email = $row['email'];
          $rs_mail_content = $row['eval_mail'];

          require '../send_sz_mail.php';
          $rs_mail_success = send_sz_mail($rs_email, "Evaluation deiner Beratung", null, $rs_mail_content, null);

          if ($rs_mail_success) {
            $update_query = mysqli_query($db_conn, "UPDATE termine SET evaluationSent=1 WHERE terminId='$terminId'");
            echo json_encode([
                "success" => 1,
                "msg" => "Evaluationslink erfolgreich verschickt."
            ]);
          } else {
            $errorMessage = error_get_last()['message'];
            echo json_encode([
                "success" => 0,
                "msg" => $errorMessage
            ]);
          }
        } else {
          echo json_encode([
              "success" => 0,
              "msg" => "Keine Daten empfangen."
          ]);
        }
      }
    catch (Exception $e){

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
