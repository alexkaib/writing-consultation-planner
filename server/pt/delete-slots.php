<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Headers, Authorization, X-Requested-With");

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

        // Access is granted.
        $data_array = (array) $decoded_array['data'];
        $user_id = $data_array['userId'];

        $post_data = json_decode(file_get_contents("php://input"));

        if (isset($post_data->numberOfDays) && isset($post_data->cancelAppointments)) {

          $num_days = $post_data->numberOfDays - 1;
          $today = date("Y-m-d");
          $cancel_until = date("Y-m-d", strtotime('+ '.$num_days.' days'));

          $sql = "SELECT * FROM termine WHERE tutorId='$user_id'
            AND datum BETWEEN '$today' AND '$cancel_until'";

          $to_cancel = mysqli_query($db_conn, $sql);

          if ($to_cancel) {
            $slots = mysqli_fetch_all($to_cancel, MYSQLI_ASSOC);

            foreach ($slots as $key => $slot) {
              $id = $slot['terminId'];
              if ($slot['available'] == 1) {
                //plain delete
                $deleteSlot = mysqli_query($db_conn, "DELETE FROM `termine` WHERE `terminId`='$id'");
              } else {
                //check if it's a follow-up
                $last_appointment = mysqli_query($db_conn, "SELECT terminId FROM termine WHERE followUpId='$id'");

                list($year, $month, $day) = explode("-", $slot['datum']);
                $time = $slot['timeslot'];
                $date_time_string = "$day.$month.$year um $time:00 Uhr";

                //if it's a follow-up, notify both pt and rs and un-archive original appointment, so that new follow-up can be made later
                if (mysqli_num_rows($last_appointment) > 0) {
                  $rsId = $slot['rsId'];
                  $rs_query = mysqli_query($db_conn, "SELECT firstName, email FROM ratsuchende WHERE rsId = '$rsId'");
                  $rs = mysqli_fetch_assoc($rs_query);
                  $rs_mail_link = '<a href="mailto:'.$rs['email'].'">'.$rs['email'].'</a>';

                  $rs_mail_address = $rs['email'];
                  $rs_mail_subject = 'Krankheitsbedingte Absage deiner Schreibberatung';
                  $rs_mail_content = '<p>Hallo '.$rs['firstName'].',</p>
                    <p>du hattest einen Schreibberatungstermin am '.$date_time_string.' vereinbart.
                    Leider müssen wir den Termin absagen, weil dein*e Berater*in in diesem Zeitraum krank geschrieben ist.
                    Du bekommst von ihr*ihm eine E-Mail mit einem neuen Terminvorschlag, sobald es möglich ist.</p>
                    <p>Mit freundlichen Grüßen,<br>Dein Schreibzentrum</p>';

                  $rs_mail_content_plain = 'Hallo '.$rs['firstName'].",\n\n
                    du hattest einen Schreibberatungstermin am $date_time_string vereinbart.
                    Leider müssen wir den Termin absagen, weil dein*e Berater*in in diesem Zeitraum krank geschrieben ist.
                    Du bekommst von ihr*ihm eine E-Mail mit einem neuen Terminvorschlag, sobald es möglich ist.\n\n
                    Mit freundlichen Grüßen,\nDein Schreibzentrum";

                  $pt_query = mysqli_query($db_conn, "SELECT firstName, email FROM peerTutors WHERE ptId = '$user_id'");
                  $pt = mysqli_fetch_assoc($pt_query);

                  $pt_mail_address = $pt['email'];
                  $pt_mail_subject = 'Absage einer Folgeberatung';
                  $pt_mail_content = '<p>Hallo '.$pt['firstName'].',</p>
                    <p>du hattest mit '.$rs['firstName'].' einen Schreibberatungstermin am '.$date_time_string.' vereinbart.
                    Dieser Termin wurde wegen einer Krankmeldung abgesagt. Bitte kontaktiere den*die Ratsuchende*n mit einem neuen Terminvorschlag, sobald es dir möglich ist.
                    Du erreichst ihn*sie unter '.$rs_mail_link.'. Gute Besserung!</p>';

                  $pt_mail_content_plain = 'Hallo '.$pt['firstName'].",\n\n
                  du hattest mit ".$rs['firstName'].' einen Schreibberatungstermin am '.$date_time_string.' vereinbart.
                  Dieser Termin wurde wegen einer Krankmeldung abgesagt. Bitte kontaktiere den*die Ratsuchende*n mit einem neuen Terminvorschlag, sobald es dir möglich ist.
                  Du erreichst ihn*sie unter '.$rs_mail_address.'. Gute Besserung!';

                  //make sure to un-archive original appointment, keep RS
                  $deleteSlot = mysqli_query($db_conn, "DELETE FROM `termine` WHERE `terminId`='$id'");
                  $resetOriginal = mysqli_query($db_conn, "UPDATE `termine` SET `followUpId` = NULL, `archived` = 0 WHERE `followUpId`='$id'");

                  require_once '../send_sz_mail.php';

                  $rs_mail_success = send_sz_mail($rs_mail_address, $rs_mail_subject, $rs_mail_content, $rs_mail_content_plain, null);
                  $pt_mail_success = send_sz_mail($pt_mail_address, $pt_mail_subject, $pt_mail_content, $pt_mail_content_plain, null);
                }

                //if it's not a follow-up, notify rs and delete their entry from database, so that they can make new appointment
                else {
                  $rsId = $slot['rsId'];

                  $rs_query = mysqli_query($db_conn, "SELECT firstName, email FROM ratsuchende WHERE rsId = '$rsId'");
                  $rs = mysqli_fetch_assoc($rs_query);

                  $rs_mail_address = $rs['email'];
                  $rs_mail_subject = 'Krankheitsbedingte Absage deiner Schreibberatung';
                  $rs_mail_content = '<p>Hallo '.$rs['firstName'].',</p>
                    <p>du hast dich vor Kurzem für einen Schreibberatungstermin am '.$date_time_string.' angemeldet.
                    Leider müssen wir den Termin absagen, weil dein*e Berater*in in diesem Zeitraum krank geschrieben ist.
                    Bitte vereinbare unter <a href="https://sz.uni-frankfurt.de">sz.uni-frankfurt.de</a> einen neuen Termin.
                    Vielen Dank für dein Verständnis.</p>
                    <p>Mit freundlichen Grüßen,<br>Dein Schreibzentrum</p>';

                  $rs_mail_content_plain = 'Hallo '.$rs['firstName'].",\n\n
                    ddu hast dich vor Kurzem für einen Schreibberatungstermin am ".$date_time_string." angemeldet.
                    Leider müssen wir den Termin absagen, weil dein*e Berater*in in diesem Zeitraum krank geschrieben ist.
                    Bitte vereinbare unter sz.uni-frankfurt.de einen neuen Termin.
                    Vielen Dank für dein Verständnis.\n\n
                    Mit freundlichen Grüßen,\nDein Schreibzentrum";

                  $deleteSlot = mysqli_query($db_conn, "DELETE FROM `termine` WHERE `terminId`='$id'");
                  $deleteRS = mysqli_query($db_conn, "DELETE FROM `ratsuchende` WHERE `rsId`='$rsId'");

                  require_once '../send_sz_mail.php';
                  
                  $rs_mail_success = send_sz_mail($rs_mail_address, $rs_mail_subject, $rs_mail_content, $rs_mail_content_plain, null);
                }
              }
            }

            echo json_encode([
                "success" => 1,
                "msg" => "Die Termine wurden abgesagt"
            ]);
          } else {
            echo json_encode([
                "success" => 0,
                "msg" => "Datenbankabfrage nicht erfolgreich."
            ]);
          }
        }
        else {
          echo json_encode(["success"=>0, "msg"=>"Keine Daten empfangen"]);
        }

    }catch (Exception $e){

    http_response_code(401);

    echo json_encode(array(
        "msg" => "Zugangsdaten sind abgelaufen. Bitte melde dich erneut an.",
        "error" => $e->getMessage()
    ));
}
}
 ?>
