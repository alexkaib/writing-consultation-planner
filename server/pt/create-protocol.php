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

        $terminId = $post_data->terminId;
        $protocolInfo = $post_data->protocolInfo;

        function unpackCheckboxDict($checkboxDict) {
          $values = [];
          foreach ($checkboxDict as $key => $value) {
            if ($value) {
              array_push($values, $key);
            }
          }
          return implode("_", $values);
        }

        $topics = unpackCheckboxDict($protocolInfo->topics);
        $writingPhase = unpackCheckboxDict($protocolInfo->writingPhase);

        $stmt = $db_conn->prepare("INSERT INTO protocols (
            ptId,
            terminId,
            RSAnwesend,
            Beratungsschwerpunkt,
            Schreibphase,
            Verlauf,
            ReflexionAllgemein,
            ReflexionMethode,
            ReflexionPersoenlich,
            Arbeitsvereinbarung
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->bind_param(
          "iiisssssss",
          $user_id,
          $terminId,
          $protocolInfo->stattgefunden,
          $topics,
          $writingPhase,
          $protocolInfo->proceedings,
          $protocolInfo->reflectionGeneral,
          $protocolInfo->reflectionMethods,
          $protocolInfo->reflectionPersonal,
          $protocolInfo->workAgreement
        );

        $stmt->execute();

        //add error check

        $protocolId = $stmt->insert_id;

        $connectTermin = mysqli_query($db_conn, "UPDATE `termine` SET `protocolId` = '$protocolId' WHERE `terminId` = '$terminId'");

        if ($connectTermin) {
          echo json_encode([
              "success" => 1,
              "msg" => "Protokoll gespeichert.",
              "protocolId" => $protocolId
          ]);
        } else {
          echo json_encode([
              "success" => 0,
              "msg" => "Beim Speichern des Protokolls ist ein Fehler aufgetreten."
          ]);
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
