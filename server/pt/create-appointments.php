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

        if (isset($post_data->weekday_and_slot_list) && is_numeric($post_data->number_of_weeks)) {

          $weekday_and_slot_list = $post_data->weekday_and_slot_list;
          $number_of_weeks = $post_data->number_of_weeks;
          $consultationForms = $post_data->forms;

          foreach ($weekday_and_slot_list as $weekday_and_slot) {
            $appointment_array = explode("-", $weekday_and_slot);
            $weekday = $appointment_array[0];
            $slot = $appointment_array[1];

            // find the first date of the selected weekday
            $first_date = strtotime('today');
            for ($i=1; $i < 8; $i++) {
              $first_date = strtotime("+ $i day");
              if (date("w", $first_date) == $weekday) {
                $first_date_format = date("Y-m-d", $first_date);
                break;
              }
            }

            $stmt = $db_conn->prepare("INSERT INTO termine (datum, weekday, timeslot, tutorId, available) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("siiii", $date_to_insert_format, $weekday, $slot, $user_id, $avail);
            $avail = 1;

            //insert current slot number_of_weeks times
            for ($i=0; $i < $number_of_weeks; $i++) {
              $date_to_insert = strtotime("+ $i week", $first_date);
              $date_to_insert_format = date("Y-m-d", $date_to_insert);

              //skipping dates that already exist
              $does_exist = mysqli_query($db_conn, "SELECT * FROM `termine` WHERE `datum`='$date_to_insert_format' AND `timeslot`='$slot' AND `tutorId`='$user_id'");
              if (mysqli_num_rows($does_exist) !== 0) {
                continue;
              }

              $createSlot = $stmt->execute();

              if($createSlot){
                $terminId = $stmt->insert_id;
                // create mapping between "termine" and "beratungsformen"
                // by inserting one row per posted form into "terminFormMap"
                $mapStmt = $db_conn->prepare("INSERT INTO terminFormMap (terminId, formId) VALUES (?, ?)");
                foreach ($consultationForms as $form) {
                  $form_query = mysqli_query($db_conn, "SELECT formId FROM beratungsformen WHERE name='$form'");
                  if (mysqli_num_rows($form_query) < 1) {
                    echo json_encode([
                      "success"=>0,
                      "msg"=>"Die Beratungsform $form konnte nicht in der Datenbank gefunden werden. Terminerstellung wurde abgebrochen."
                    ]);
                    die;
                  }
                  $form_id = mysqli_fetch_object($form_query)->formId;
                  $mapStmt->bind_param("ii", $terminId, $form_id);
                  $mapStmt->execute();
                }
              }
              else {
                echo json_encode(["success"=>0, "msg"=>"Es gab einen Datenbankfehler beim Erstellen eines Termins."]);
                die;
              }
            }
          }
          echo json_encode(["success"=>1, "msg"=>"Alle Termine erstellt."]);
        }
        else {
          echo json_encode(["success"=>0, "msg"=>"Keine Termin-Daten empfangen"]);
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
