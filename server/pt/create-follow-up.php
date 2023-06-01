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
        $data_array = (array) $decoded_array['data'];
        $user_id = $data_array['userId'];

        $post_data = json_decode(file_get_contents("php://input"));

        if (isset($post_data->followUpDate) &&
            isset($post_data->followUpTime) &&
            isset($post_data->previousTerminId) &&
            isset($post_data->rsId) &&
            isset($post_data->followUpWeekday)
          ) {

          $date = $post_data->followUpDate;
          $time = $post_data->followUpTime;
          $weekday = $post_data->followUpWeekday;
          $previous_termin_id = $post_data->previousTerminId;
          $rsId = $post_data->rsId;

          $date_regex = '/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/';

          if (preg_match($date_regex, $date)) {

            $follow_up_termin_query = mysqli_query($db_conn, "SELECT * FROM termine WHERE tutorId='$user_id' AND datum='$date' AND timeslot='$time'");

            //checks if appointment is already being offered at given time
            if (mysqli_num_rows($follow_up_termin_query) > 0) {
              $follow_up_termin = mysqli_fetch_assoc($follow_up_termin_query);
              //checks if that appointment is already taken
              if ($follow_up_termin["available"] == 0) {
                echo json_encode(["success"=>0, "msg"=>"Termin ist bereits vergeben."]);
              }
              //updates existing database-entry
              else {
                $follow_up_termin_id = $follow_up_termin['terminId'];
                $stmt = $db_conn->prepare("UPDATE termine SET available=?, rsId=? WHERE terminId=?");
                $stmt->bind_param("iii", $avail, $rsId, $follow_up_termin_id);
                $avail = 0;
                $stmt->execute();

                if ($stmt->error) {
                  echo json_encode([
                      "success" => 0,
                      "msg" => "Beim Eintragen des Termins ist ein Fehler aufgetreten."
                  ]);
                } else {
                  //fills in old appointment's followUpId
                  $stmt = $db_conn->prepare("UPDATE termine SET followUpId=? WHERE terminId=?");
                  $stmt->bind_param("ii", $follow_up_termin_id, $previous_termin_id);
                  $stmt->execute();
                  echo json_encode([
                      "success" => 1,
                      "msg" => "Termin erfolgreich eingetragen."
                  ]);
                }
              }
            }
            //No appointment exists, so create new one
            else {
              $stmt = $db_conn->prepare("INSERT INTO termine (datum, weekday, timeslot, tutorId, available, rsId) VALUES (?, ?, ?, ?, ?, ?)");
              $stmt->bind_param("siiiii", $date, $weekday, $time, $user_id, $avail, $rsId);
              $avail = 0;
              $stmt->execute();

              if ($stmt->error) {
                echo json_encode([
                    "success" => 0,
                    "msg" => "Beim Eintragen des Termins ist ein Fehler aufgetreten."
                ]);
              } else {
                //fills in old appointment's followUpId
                $follow_up_termin_id = $stmt->insert_id;
                $stmt = $db_conn->prepare("UPDATE termine SET followUpId=? WHERE terminId=?");
                $stmt->bind_param("ii", $follow_up_termin_id, $previous_termin_id);
                $stmt->execute();
                echo json_encode([
                    "success" => 1,
                    "msg" => "Termin erfolgreich eingetragen."
                ]);
              }
            }
          }
          //date didnt arrive in correct format
          else {
            echo json_encode([
                "success" => 0,
                "msg" => "Unzulässiges Datumsformat."
            ]);
          }
        }
        //sent json is not complete
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
