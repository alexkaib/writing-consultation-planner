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

  //only show appointments in the future
  $today = date("Y-m-d");

  $sql = "SELECT t.terminId, t.datum, t.fromTime, t.toTime, t.guestRequest, pt.firstName, pt.lastName, rs.bookedTypeId, rs.bookedFormat
    FROM termine t
    INNER JOIN peerTutors pt ON (pt.ptId = t.tutorId)
    INNER JOIN ratsuchende rs ON (rs.rsId = t.rsId)
    WHERE t.available = 0
    AND t.datum >= '$today'";

  $all_appointments = mysqli_query($db_conn, $sql);

  if ($all_appointments) {
    $res = mysqli_fetch_all($all_appointments, MYSQLI_ASSOC);

    echo json_encode([
        "success" => 1,
        "slots" => $res
    ]);
  } else {
    echo json_encode([
        "success" => 0,
        "msg" => "Datenbankabfrage nicht erfolgreich."
    ]);
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
