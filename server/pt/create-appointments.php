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

        if (isset($post_data->date) && isset($post_data->appointmentInfo)) {
          $first_date = strtotime($post_data->date);
          $is_digital = $post_data->appointmentInfo->digital;
          $is_analogue = $post_data->appointmentInfo->analogue;
          $from_time = $post_data->appointmentInfo->fromTime;
          $to_time = $post_data->appointmentInfo->toTime;
          $type_ids = $post_data->appointmentInfo->selectedTypeIds;

          // TODO: select this as part of client form
          $number_of_weeks = 1;
          // prepare appointment insertion
          $stmt = $db_conn->prepare("INSERT INTO termine (datum, fromTime, toTime, analogue, digital, tutorId, available) VALUES (?, ?, ?, ?, ?, ?, ?)");
          $stmt->bind_param("sssiiii", $date_to_insert_format, $from_time, $to_time, $is_analogue, $is_digital, $user_id, $avail);
          $avail = 1;

          //insert appointment number_of_weeks times
          for ($i=0; $i < $number_of_weeks; $i++) {
            $date_to_insert = strtotime("+ $i week", $first_date);
            $date_to_insert_format = date("Y-m-d", $date_to_insert);

            //skipping dates that already exist
            $check_sql = "SELECT * FROM `termine` WHERE `datum`='$date_to_insert_format' AND `fromTime`='$from_time' AND `toTime`='$to_time' AND `tutorId`='$user_id'";
            if ($does_exist = mysqli_query($db_conn, $check_sql)) {
              if (mysqli_num_rows($does_exist) !== 0) continue;
            }

            $createSlot = $stmt->execute();

            if($createSlot){
              $termin_id = $stmt->insert_id;
              // create mapping between "termine" and "consultationTypes"
              // by inserting one row per selected type into "terminFormMap"
              $mapStmt = $db_conn->prepare("INSERT INTO terminFormMap (terminId, formId) VALUES (?, ?)");

              foreach ($type_ids as $type_id) {
                $mapStmt->bind_param("ii", $termin_id, $type_id);
                $mapStmt->execute();
              }
            }
            else {
              echo json_encode(["success"=>0, "msg"=>"Es gab einen Datenbankfehler beim Erstellen eines Termins."]);
              die;
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
