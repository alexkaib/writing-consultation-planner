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

        if (isset($post_data->date) && isset($post_data->time) && isset($post_data->forms)) {

          $date = $post_data->date;
          $time = $post_data->time;
          $consultationForms = $post_data->forms;

          $stmt = $db_conn->prepare("INSERT INTO termine (datum, timeslot, tutorId, available) VALUES (?, ?, ?, ?)");
          $stmt->bind_param("siii", $date, $time, $user_id, $avail);
          $avail = 1;

          $createSlot = $stmt->execute();

          if($createSlot){
            $terminId = $stmt->insert_id;
            // create mapping between "termine" and "beratungsformen"
            // by inserting one row per posted form into "terminFormMap"
            $stmt = $db_conn->prepare("INSERT INTO terminFormMap (terminId, formId) VALUES (?, ?)");
            foreach ($consultationForms as $form) {
              $form_query = mysqli_query($db_conn, "SELECT formId FROM beratungsformen WHERE name='$form'");
              $form_id = mysqli_fetch_object($form_query)->formId;
              $stmt->bind_param("ii", $terminId, $form_id);
              $stmt->execute();
            }
            echo json_encode(["success"=>1, "terminId"=>$terminId, "msg"=>"Termin erstellt."]);
          }
          else {
            echo json_encode(["success"=>0, "msg"=>"Es gab einen Datenbankfehler beim Erstellen des Termins."]);
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
