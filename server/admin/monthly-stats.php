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

  $type = $post_data->type;

  $from_month = $post_data->from_month;
  $from_year = $post_data->from_year;
  $to_month= $post_data->to_month;
  $to_year = $post_data->to_year;

  $month = $from_month;
  $year = $from_year;
  $span = ($to_year - $from_year) * 12 + ($to_month - $from_month + 1);

  if ($span < 1) {
    echo json_encode([
        "success" => 0,
        "msg" => "Startdatum muss vor Enddatum liegen."
    ]);
  }
  else {
  //data should be a json-array in the form of:
  // {month: xyz, conferences_total: abc, conferences_offered: x, no_shows, protocols etc.}

  //initialize data array
  $data = [];

  for ($i=0; $i < $span; $i++) {
    //initialize month array
    $month_array = array(
      'month' => $month,
      'offered' => 0,
      'appointments' => 0,
      'protocols' => 0,
      'noshows' => 0
    );

    $from=date("Y-m-d", mktime(0, 0, 0, $month, 1, $year));

    if ($month == 12) {
      $year += 1;
      $month = 1;
    } else {
      $month += 1;
    }

    $to=date("Y-m-d", mktime(0, 0, 0, $month, 1, $year));

    $month_sql = "SELECT t.terminId, t.available, t.datum, t.fromTime, t.protocolId, p.RSAnwesend
                    FROM termine t
                    LEFT JOIN ratsuchende rs ON (rs.rsId = t.rsId)
                    LEFT JOIN protocols p ON (p.protocolId = t.protocolId)
                    WHERE t.datum >= '$from' AND t.datum < '$to'";

    if ($type > -1) {
      $month_sql .= " AND rs.bookedTypeId=$type";
    }

    $month_data = mysqli_query($db_conn, $month_sql);

    $month_array['offered'] = $month_data->num_rows;

    if ($month_data->num_rows > 0) {
      $offered = $month_data->fetch_all(MYSQLI_ASSOC);

      foreach($offered as $month_data => $row) {
        if ($row['available'] == 0) {
          $month_array['appointments'] += 1;
        }
        if ($row['protocolId'] > -1) {
          $month_array['protocols'] += 1;
          if ($row['RSAnwesend'] !== '1') {
            $month_array['noshows'] += 1;
          }
        }
      }
    }

    $data[$i] = $month_array;
  }

  if ($data) {
    echo json_encode([
        "success" => 1,
        "data" => $data
    ]);
  } else {
    echo json_encode([
        "success" => 0,
        "msg" => "Datenbankabfrage nicht erfolgreich."
    ]);
  }
}
}catch (Exception $e){

http_response_code(401);

echo json_encode(array(
    "message" => "Access denied.",
    "error" => $e->getMessage()
));
}
}
else {
echo json_encode(["success"=>0, "msg" => "Keine Zugangsdaten gefunden. Bitte melde dich erneut an."]);
}
?>
