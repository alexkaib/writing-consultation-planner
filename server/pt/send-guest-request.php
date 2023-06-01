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

if (isset($post_data->terminId)) {
  $sql = "SELECT t.datum, t.timeslot, pt.email, pt.firstName FROM termine t
          INNER JOIN peerTutors pt ON (pt.ptId = t.tutorId)
          WHERE t.terminId = '$post_data->terminId'";

  $appointment = mysqli_fetch_assoc(mysqli_query($db_conn, $sql));
  $dateString = implode('.', array_reverse(explode('-', $appointment['datum'])));
  $timeString = $appointment['timeslot'] . ':00 Uhr';
  $pt_mail = $appointment['email'];
  $pt_name = $appointment['firstName'];

  $sql = "SELECT email, firstName FROM peerTutors WHERE ptId='$user_id'";
  $guest = mysqli_fetch_assoc(mysqli_query($db_conn, $sql));
  $guest_mail = $guest['email'];
  $guest_name = $guest['firstName'];
  $guest_mail_link = '<a href="mailto:'.$guest_mail.'">'.$guest_mail.'</a>';

  $sql = "UPDATE termine SET guestRequest=1 WHERE terminId='$post_data->terminId'";
  mysqli_query($db_conn, $sql);

  $mail_subject = 'Hospitationsanfrage';
  $mail_content = "
    <p>Hallo $pt_name,</p>
    <p>$guest_name würde gerne bei deinem Beratungstermin am <strong>$dateString um $timeString</strong> hospitieren.
    Bitte sag Bescheid, ob du damit einverstanden bist. Du erreichst ihn*sie unter ".$guest_mail_link.".</p>
    <p>";

  $mail_content_plain = "
    Hallo $pt_name,\n\n
    $guest_name würde gerne bei deinem Beratungstermin am $dateString um $timeString hospitieren.
    Bitte sag Bescheid, ob du damit einverstanden bist. Du erreichst ihn*sie unter $guest_mail";

  require '../send_sz_mail.php';

  $mail_success = send_sz_mail($pt_mail, $mail_subject, $mail_content, $mail_content_plain, null);

  if ($mail_success === 'success') {
    echo json_encode([
      "success" => 1,
      "msg" => "Anfrage erfolgreich verschickt."
    ]);
  } else {
    echo json_encode([
      "success" => 0,
      "msg" => "Mailversand nicht erfolgreich."
    ]);
  }
} else {
  echo json_encode([
    "success" => 0,
    "msg" => "Keine Daten empfangen."
  ]);
}

}
catch (Exception $e){

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
