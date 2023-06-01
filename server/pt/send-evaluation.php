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

        $post_data = json_decode(file_get_contents("php://input"));

        if (isset($post_data->terminId) && isset($post_data->rsEmail) && isset($post_data->rsName)) {
          $terminId = $post_data->terminId;

          $headers   = array();
          $headers[] = "MIME-Version: 1.0";
          $headers[] = "Content-type: text/html; charset=utf-8";
          $headers[] = "From: schreibzentrum@dlist.uni-frankfurt.de";

          $message = '
            <html>
            <head>
              <title>Evaluation deiner Schreibberatung</title>
            </head>
            <body>
              <p>Hallo '.$post_data->rsName.',</p>
              <br>
              <p>du hattest vor Kurzem eine Schreibberatung. Es würde uns helfen, wenn du uns ein kurzes, anonymes Feedback hinterlassen würdest. Bitte verwende dafür folgenden Link:</p>
              <p><a href="https://online-eval.studiumdigitale.uni-frankfurt.de/evasys/online.php?p=sb2021">https://online-eval.studiumdigitale.uni-frankfurt.de/evasys/online.php?p=sb2021</a></p>
              <p>Damit wir dein Feedback zuordnen können, gib bei der Befragung bitte folgende Beratungs-ID an: '.$terminId.'</p>
              <br>
              <p>Vielen Dank für deine Unterstützung,</p>
              <p>Dein Schreibzentrum</p>
            </body>
            </html>
            ';

          if ($post_data->role==="methodTutor") {
            $message = '
              <html>
              <head>
                <title>Evaluation der Methodenberatung</title>
              </head>
              <body>
                <p>Hallo '.$post_data->rsName.',</p>
                <br>
                <p>du hattest vor Kurzem eine Methodenberatung. Es würde uns helfen, wenn du uns ein kurzes, anonymes Feedback hinterlassen würdest. Bitte verwende dafür folgenden Link:</p>
                <p><a href="https://online-eval.studiumdigitale.uni-frankfurt.de/evasys/online.php?p=Peer-Beratung">https://online-eval.studiumdigitale.uni-frankfurt.de/evasys/online.php?p=Peer-Beratung</a></p>
                <p>Damit wir dein Feedback zuordnen können, gib bei der Befragung bitte folgende Beratungs-ID an: '.$terminId.'</p>
                <br>
                <p>Vielen Dank für deine Unterstützung,</p>
                <p>Dein Methodenzentrum</p>
              </body>
              </html>
              ';
          }

          if ($post_data->role==="methodTutor") {
            $success = mail($post_data->rsEmail, 'Wie war die Methodenberatung?', $message, implode("\r\n",$headers));
          } else {
            $success = mail($post_data->rsEmail, 'Wie war die Schreibberatung?', $message, implode("\r\n",$headers));
          }

          if ($success) {
            $update_query = mysqli_query($db_conn, "UPDATE termine SET evaluationSent=1 WHERE terminId='$terminId'");
            echo json_encode([
                "success" => 1,
                "msg" => "Evaluationslink erfolgreich verschickt."
            ]);
          } else {
            $errorMessage = error_get_last()['message'];
            echo json_encode([
                "success" => 0,
                "msg" => $errorMessage
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

    echo json_encode(array(
        "success" => 0,
        "msg" => "Zugangsdaten sind abgelaufen. Bitte melde dich erneut an.",
        "error" => $e->getMessage()
    ));
    }
}
else {
echo json_encode(["success"=>0, "msg" => "Keine Zugangsdaten gefunden. Bitte melde dich erneut an."]);
}
