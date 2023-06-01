<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../db_connection.php';

$post_data = json_decode(file_get_contents("php://input"));

$terminId = (int) $post_data->appointmentId;
$long_ago = strtotime("2000-01-01");
$long_ago_format = date("Y-m-d H:i:s", $long_ago);

$stmt = $db_conn->prepare(
  "UPDATE `termine` SET `lastAccessed` = '$long_ago_format' WHERE `terminId` = ?"
);
$stmt->bind_param("i", $terminId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
  echo json_encode([
      "success" => 1,
      "msg" => "Termin geupdatet."
  ]);
} else {
  echo json_encode([
      "success" => 0,
      "msg" => "Beim Updaten des Termins ist ein Fehler aufgetreten."
  ]);
}
