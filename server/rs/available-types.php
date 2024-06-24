<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../db_connection.php';

$sql = "SELECT id, name_de, name_en, audience
        FROM consultationTypes
        WHERE active = 1";

$all_types = $db_conn->query($sql);

if ($all_types->num_rows > 0) {
  $res = mysqli_fetch_all($all_types, MYSQLI_ASSOC);

  echo json_encode([
      "success" => 1,
      "types" => $res,
  ]);
} else {
  echo json_encode([
      "success" => 0,
      "msg" => "Datenbankabfrage nicht erfolgreich."
  ]);
}
?>
