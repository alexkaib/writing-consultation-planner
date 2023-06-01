<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../db_connection.php';

$post_data = json_decode(file_get_contents("php://input"));

$terminId = (int) $post_data->appointmentId;
$datum = $post_data->date;
$time = $post_data->time;
$tutorId = $post_data->ptId;
$now = date("Y-m-d H:i:s");

$stmt = $db_conn->prepare(
  "UPDATE `termine` SET `lastAccessed` = '$now' WHERE `terminId` = ?"
);
$stmt->bind_param("i", $terminId);
$stmt->execute();

if ($stmt->affected_rows > 0) {
  echo json_encode([
      "success" => 1,
      "msg" => "Termin reserviert."
  ]);
} else {
  echo json_encode([
      "success" => 0,
      "msg" => "Beim Reservieren des Termins ist ein Fehler aufgetreten."
  ]);
}
