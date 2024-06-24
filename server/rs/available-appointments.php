<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: GET");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../db_connection.php';

$type_id = $_GET['type'];

// get additional info text to display
$sql = "SELECT name_de, name_en, info_de, info_en FROM consultationTypes WHERE id=?";
$stmt = $db_conn->prepare($sql);
$stmt->bind_param("i", $type_id);
$stmt->execute();
$type_info = $stmt->get_result()->fetch_assoc();

// only show appointments not accessed (by someone else) in the last 10 minutes
$ten_min = strtotime('-10 minutes');
$ten_min_format = date("Y-m-d H:i:s", $ten_min);
// only show future appointments
$tomorrow = strtotime('tomorrow');
$tomorrow_format = date("Y-m-d", $tomorrow);

$sql = "SELECT c.min_date, c.max_date,
  t.terminId, t.datum, t.fromTime, t.toTime, t.analogue, t.digital, t.tutorId,
  pt.firstName, pt.subjects
  FROM termine t
  INNER JOIN peerTutors pt ON (pt.ptId = t.tutorId)
  INNER JOIN terminFormMap map ON (map.terminId = t.terminId)
  INNER JOIN consultationTypes c ON (c.id = map.formId)
  WHERE t.available = '1'
  AND t.datum >= '$tomorrow_format'
  AND t.lastAccessed < '$ten_min_format'
  AND c.id = ?";

$stmt = $db_conn->prepare($sql);
$stmt->bind_param("i", $type_id);
$stmt->execute();
$all_appointments = $stmt->get_result();

if ($all_appointments) {
  $rows = mysqli_fetch_all($all_appointments, MYSQLI_ASSOC);

  if (mysqli_num_rows($all_appointments) > 0) {
    // filter out appointments that are not in the consultation type's time frame
    $min_days = $rows[0]["min_date"];
    $max_days = $rows[0]["max_date"];
    $min_date = strtotime("today + $min_days days");
    $max_date = strtotime("today + $max_days days");

    $res = array_filter($rows, function ($row) use ($min_date, $max_date) {
      $date = strtotime($row["datum"]);
      return $date <= $max_date && $date >= $min_date;
    });
  } else {
    $res = array();
  }

  echo json_encode([
      "success" => 1,
      "slots" => $res,
      "typeInfo" => $type_info
  ]);
} else {
  echo json_encode([
      "success" => 0,
      "msg" => "Datenbankabfrage nicht erfolgreich."
  ]);
}
?>
