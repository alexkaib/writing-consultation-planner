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

        $protocolToUpdate = $post_data->protocolToUpdate;
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

        $columns = array();
        $values = array();
        //$stmt = $db_conn->prepare("INSERT INTO ratsuchende (?) VALUES (?)");
        // instead: associative array.keys as first (?, ?, ...) list, values as second
        $col_count = 0;
        foreach ($protocolInfo as $column => $value) {
          array_push($columns, $column);
          $col_count += 1;
          if (is_object($value)) {
            $value = unpackCheckboxDict($value);
          }
          array_push($values, $value);
        }
        // include received protocol id in values for statement execution
        array_push($values, $protocolToUpdate);

        $sql = "UPDATE protocols SET " . implode('=?, ', $columns);
        $sql .= "=? WHERE protocolId=?";
        $stmt = $db_conn->prepare($sql);

        $stmt->bind_param("i" . implode(array_fill(0, $col_count-1, 's')) . "i", ...$values);
        $stmt->execute();

        if ($stmt->error) {
          echo json_encode([
              "success" => 0,
              "msg" => "Beim Ausführen des Updates ist ein Fehler aufgetreten.",
              "err" => $stmt->error
          ]);
        } else {
          echo json_encode([
              "success" => 1,
              "msg" => "Protokoll wurde erfolgreich geändert."
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
