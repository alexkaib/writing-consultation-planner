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

        if (isset($post_data->terminId)) {
          $terminId = $post_data->terminId;

          // archiving was done without protocol, so create one here
          if (isset($post_data->rsWasPresent)) {

            $stmt = $db_conn->prepare("INSERT INTO protocols (
                ptId,
                terminId,
                RSAnwesend
              ) VALUES (?, ?, ?)");

            $stmt->bind_param(
              "iii",
              $user_id,
              $terminId,
              $post_data->rsWasPresent
            );
            $stmt->execute();

            $protocolId = $stmt->insert_id;

            $connectTermin = mysqli_query($db_conn, "UPDATE `termine` SET `protocolId` = '$protocolId' WHERE `terminId` = '$terminId'");
          }

          $update_query = mysqli_query($db_conn, "UPDATE termine SET archived=1 WHERE terminId='$terminId'");

          if ($update_query) {
            // check if rs personal data needs to be kept
            // by looking for consultation with them that hasn't been archived
            $rsId = $post_data->rsId;
            $otherConsultationsWithSameRS = mysqli_query($db_conn, "SELECT terminId FROM termine WHERE rsId='$rsId' AND archived=0");

            if (mysqli_num_rows($otherConsultationsWithSameRS) > 0) {
              echo json_encode([
                  "success" => 1,
                  "msg" => "Termin erfolgreich archiviert. Kontaktinformation der Ratsuchenden wurden aufgrund einer vorhandenen Folgeberatung nicht gelöscht."
              ]);
            } else {
              if (isset($post_data->rsId)) {
                $anonymize_query = mysqli_query($db_conn, "UPDATE ratsuchende SET firstName='Archiviert', lastName='Archiviert', email='Archiviert' WHERE rsId='$rsId'");

                if ($anonymize_query) {
                  echo json_encode([
                      "success" => 1,
                      "msg" => "Termin erfolgreich archiviert und Kontaktinformation der Ratsuchenden wurden gelöscht."
                  ]);
                } else {
                  echo json_encode([
                      "success" => 0,
                      "msg" => "Der Termin wurde archiviert, aber beim Anonymisieren der Ratsuchenden trat ein Datenbankfehler auf. Bitte wende dich an die*den Server-Administrator*in. ID der Ratsuchenden: " . (string) $rsId
                  ]);
                }
              } else {
                echo json_encode([
                    "success" => 0,
                    "msg" => "Der Termin wurde archiviert, aber da keine Ratsuchenden-ID empfangen wurde, konnte keine Anonymisierung stattfinden. Wende dich bitte an die*den Server-Administrator*in, um das Problem zu beheben. ID des Termins: " . (string) $terminId
                ]);
              }
            }
          } else {
            echo json_encode([
                "success" => 0,
                "msg" => "Der Termin konnte nicht archiviert werden. Beim Bearbeiten trat ein Datenbankfehler auf."
            ]);
          }
        } else {
          echo json_encode([
              "success" => 0,
              "msg" => "Keine Termindaten empfangen."
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
