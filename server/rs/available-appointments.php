<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../db_connection.php';

$type = $_GET['type'];
$type_analogue = $type . '_analogue';
$type_digital = $type . '_digital';
//only show appointments not accessed (by someone else) in the last 10 minutes
$ten_min = strtotime('-10 minutes');
$ten_min_format = date("Y-m-d H:i:s", $ten_min);
//only show appointments starting three days from now
$three_days = strtotime('+3 days');
$three_days_format = date("Y-m-d H:i:s", $three_days);
//only show appointments within the next two weeks of upcoming monday
$next_monday = strtotime('next monday');

if ($type === 'go') {
  $end_date = strtotime('+ 37 days', $next_monday);
} else {
  $end_date = strtotime('+ 12 days', $next_monday);
}

$end_date_format = date("Y-m-d H:i:s", $end_date);

$sql = "SELECT bf.name, pt.firstName, pt.subjects,
  t.terminId, t.datum, t.timeslot, t.tutorId, t.available
  FROM termine t
  INNER JOIN peerTutors pt ON (pt.ptId = t.tutorId)
  INNER JOIN terminFormMap map ON (map.terminId = t.terminId)
  INNER JOIN beratungsformen bf ON (bf.formId = map.formId)
  WHERE t.available = '1'
  AND t.datum BETWEEN '$three_days_format' AND '$end_date_format'
  AND t.lastAccessed < '$ten_min_format'
  AND (bf.name = ? OR bf.name = ?)";

$stmt = $db_conn->prepare($sql);
$stmt->bind_param("ss", $type_analogue, $type_digital);
$stmt->execute();
$all_appointments = $stmt->get_result();

if ($all_appointments) {
  $res = mysqli_fetch_all($all_appointments, MYSQLI_ASSOC);

  echo json_encode([
      "success" => 1,
      "slots" => $res,
  ]);
} else {
  echo json_encode([
      "success" => 0,
      "msg" => "Datenbankabfrage nicht erfolgreich."
  ]);
}
?>
