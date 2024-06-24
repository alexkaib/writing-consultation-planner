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
    $user_role = $data_array['userRole'];

    if ($user_role !== 'admin') {
      echo json_encode([
          "success" => 0,
          "msg" => "Access denied."
      ]);
      die();
    }

    $today = date('Y-m-d');
    $type_id = $post_data->typeId;

    //initialize data array
    $data = array(
      'openSlotsFuture' => 0,
      'openSlotsRecent' => 0,
      'openSlotsPast' => 0,
      'totalBookingsFuture' => 0,
      'totalBookingsRecent' => 0,
      'totalBookingsPast' => 0,
      'firstBookingsFuture' => 0,
      'firstBookingsRecent' => 0,
      'firstBookingsPast' => 0,
      'followUpsFuture' => 0,
      'followUpsRecent' => 0,
      'followUpsPast' => 0,
      'guestRequestsFuture' => 0,
      'guestRequestsRecent' => 0,
      'guestRequestsPast' => 0,
      'protocols' => 0,
      'missingProtocols' => 0,
      'noShows' => 0,
      'evaluationsSent' => 0
    );
    $sql = "SELECT DISTINCT t.terminId, t.datum FROM termine t
            INNER JOIN terminFormMap m ON t.terminId=m.terminId
            WHERE available=1 AND datum > ? AND datum <= ?";

    if (isset($type_id) && $type_id !== "") {
      $sql .= " AND m.formId=" . $type_id;
    }

    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("ss", $from, $to);

    // get open slots for next 30 days
    $from = $today;
    $to = date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")+30, date("Y")));
    $stmt->execute();

    $data['openSlotsFuture'] = $stmt->get_result()->num_rows;

    // get open slots from last 30 days
    $from = date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")-30, date("Y")));
    $to = $today;
    $stmt->execute();

    $data['openSlotsRecent'] = $stmt->get_result()->num_rows;

    // get open slots from last 180 days
    $from = date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")-180, date("Y")));
    $to = $today;
    $stmt->execute();

    $data['openSlotsPast'] = $stmt->get_result()->num_rows;

    //get booked appointments
    $sql = "SELECT t.terminId, t.protocolId, t.guestRequest, t.evaluationSent, t.predecessorId, p.RSAnwesend
            FROM termine t
            INNER JOIN ratsuchende r ON t.rsId=r.rsId
            LEFT JOIN protocols p ON t.protocolId=p.protocolId
            WHERE datum > ? AND datum <= ?
            ";

    if (isset($type_id) && $type_id !== "") {
      $sql .= " AND r.bookedTypeId=".$type_id;
    }

    $stmt = $db_conn->prepare($sql);
    $stmt->bind_param("ss", $from, $to);

    // for next 30 days
    $from = $today;
    $to = date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")+30, date("Y")));
    $stmt->execute();

    $result = $stmt->get_result();
    // sort into follow ups and first bookings
    while($row = $result->fetch_assoc()) {
      if (isset($row["predecessorId"])) {
        $data["followUpsFuture"] += 1;
      } else {
        $data["firstBookingsFuture"] += 1;
      }
      if ($row["guestRequest"] === 1) {
        $data["guestRequestsFuture"] += 1;
      }
    }
    $data["totalBookingsFuture"] = $data["firstBookingsFuture"] + $data["followUpsFuture"];

    // from last 30 days
    $from = date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")-30, date("Y")));
    $to = $today;
    $stmt->execute();

    $result = $stmt->get_result();
    // sort into follow ups and first bookings
    while($row = $result->fetch_assoc()) {
      if (isset($row["predecessorId"])) {
        $data["followUpsRecent"] += 1;
      } else {
        $data["firstBookingsRecent"] += 1;
      }
      if ($row["guestRequest"] === 1) {
        $data["guestRequestsRecent"] += 1;
      }
    }
    $data["totalBookingsRecent"] = $data["firstBookingsRecent"] + $data["followUpsRecent"];

    // from last 180 days
    $from = date('Y-m-d', mktime(0, 0, 0, date("m")  , date("d")-180, date("Y")));
    $to = $today;
    $stmt->execute();

    $result = $stmt->get_result();
    // sort into follow ups and first bookings
    // additionally, get missing protocols, no-shows and evals sent
    while($row = $result->fetch_assoc()) {
      if (isset($row["predecessorId"])) {
        $data["followUpsPast"] += 1;
      } else {
        $data["firstBookingsPast"] += 1;
      }
      if ($row["guestRequest"] === 1) {
        $data["guestRequestsPast"] += 1;
      }
      if (!$row["protocolId"]) {
        $data["missingProtocols"] += 1;
      }
      if ($row["RSAnwesend"] !== 1) {
        $data["noShows"] += 1;
      }
      if ($row["evaluationSent"] === 1) {
        $data["evaluationsSent"] += 1;
      }
    }
    $data["totalBookingsPast"] = $data["firstBookingsPast"] + $data["followUpsPast"];

    $get_types = "SELECT id, name_de, name_en, audience FROM consultationTypes
                  WHERE active=1";

    $res = mysqli_query($db_conn, $get_types);
    $types = mysqli_fetch_all($res, MYSQLI_ASSOC);
    /*
    // alle Neu-Anmeldungen
    $test = "SELECT DISTINCT t.datum, t.timeslot, t.tutorId, t.rsId FROM termine t
              INNER JOIN terminFormMap m ON t.terminId=m.terminId
              WHERE available=0 AND datum > "2023-09-03" AND datum <= "2023-10-03"
              AND (m.formId=1 OR m.formId=2)
              ";

    $test2 = "SELECT t.terminId FROM termine t
              INNER JOIN ratsuchende r ON r.rsId=t.rsId
              WHERE datum > "2023-09-03" AND datum <= "2023-10-03"
              AND r.angemeldetAls="student"
              ";

    // alle ratuchenden letzte 30 Tage
    $test3 = "SELECT t.terminId, r.* FROM ratsuchende r
              INNER JOIN termine t ON r.rsId=t.rsId
              WHERE datum > "2023-09-03" AND datum <= "2023-10-03"
              AND r.angemeldetAls="student"
              ";

              SELECT t.terminId FROM termine t
              INNER JOIN ratsuchende r ON t.rsId=r.rsId
              WHERE datum > "2023-09-04" AND datum <= "2023-10-04"
              AND r.angemeldetAls="student"

              SELECT t.terminId, p.RSAnwesend FROM termine t
              INNER JOIN ratsuchende r ON t.rsId=r.rsId
              INNER JOIN protocols p ON t.protocolId=p.protocolId
              WHERE datum > "2023-04-04" AND datum <= "2023-10-04"
              AND r.angemeldetAls="student"
              */

    if ($data) {
      echo json_encode([
          "success" => 1,
          "stats" => $data,
          "types" => $types
      ]);
    } else {
      echo json_encode([
          "success" => 0,
          "msg" => "Datenbankabfrage nicht erfolgreich."
      ]);
    }
  }
catch (Exception $e){

  http_response_code(401);

  echo json_encode(array(
      "message" => "Access denied.",
      "error" => $e->getMessage()
  ));
}}
else {
  echo json_encode(["success"=>0, "msg" => "Keine Zugangsdaten gefunden. Bitte melde dich erneut an."]);
}
?>
