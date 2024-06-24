<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

use PHPMailer\PHPMailer\PHPMailer;

require '../config.php';
require '../db_connection.php';
require '../send_sz_mail.php';

$post_data = json_decode($_POST['payload']);

//checks if there are valid text files and sets mail-attachments variable
if (count($_FILES) > 0) {
  if (count($_FILES) > 10) {
    echo json_encode([
        "success" => 0,
        "msg" => "Zu viele Dateien. / Too many files."
    ]);
    die();
  }
  $attachments = array();
  $total_filesize = 0;
  $allowed_types = $ACCEPTED_FILE_TYPES;

  foreach ($_FILES as $filename => $file) {
    $tmpfilelocation = $file['tmp_name'];
    $filename = $file['name'];
    $total_filesize += $file['size'];
    $mime_type = mime_content_type($tmpfilelocation);

    if (!in_array($mime_type, $allowed_types)) {
      echo json_encode([
          "success" => 0,
          "msg" => "Falsches Dateiformat. / Wrong file format."
      ]);
      die();
    } else if ($total_filesize > 10000000) {
      echo json_encode([
          "success" => 0,
          "msg" => "Datei ist zu groß. / File size exceeds limit."
      ]);
      die();
    } else {
      //Extract an extension from the provided filename
      $ext = PHPMailer::mb_pathinfo($filename, PATHINFO_EXTENSION);
      //Define a safe location to move the uploaded file to, preserving the extension
      $filelocation = tempnam(sys_get_temp_dir(), hash('sha256', $file['name'])) . '.' . $ext;

      if (!move_uploaded_file($tmpfilelocation, $filelocation)) {
        echo json_encode([
            "success" => 0,
            "msg" => "Failed to save file."
        ]);
        die();
      }
      array_push($attachments, ['location' => $filelocation, 'name' => $filename]);
    }
  }
} else {
  $attachments = null;
}


//checks registration info, writes info to database and sends e-mail to pt and rs
if (isset($post_data->appointmentId)) {
  $appointmentId = (int) $post_data->appointmentId;
  $tutorId = (int) $post_data->ptId;
  $consultationType = (int) $post_data->consultationType;
  $datum = $post_data->date;
  $time = $post_data->time;
  $format = $post_data->format; // "both", "analogue", or "digital"
  $termsAccepted = (int) $post_data->termsAccepted;
  $rsInfo = (array) $post_data->rsInfo;

  // check if e-mail belongs to institution domain specified in config.php
  if (isset($REQUIRED_MAIL_ENDING)) {
    $given_mail = trim($rsInfo['email']);
    $pattern = "/^[\w\-\.]+@([\w\-]+\.)*" . str_replace("-", "\-", $REQUIRED_MAIL_ENDING) ."$/i";

    if (!preg_match($pattern, $given_mail)) {
      echo json_encode([
          "success" => 0,
          "Email given" => $given_mail,
          "msg" => "Bitte nutze eine E-Mail Adresse, die auf " . $REQUIRED_MAIL_ENDING . " endet."
      ]);
      die();
    }
  }

  //checks if e-mail-address was used recently to sign up
  if (isset($DAYS_BETWEEN_REGISTRATIONS)) {
    $max_last_signup_date = date("Y-m-d H:i:s", strtotime("- $DAYS_BETWEEN_REGISTRATIONS days"));

    $stmt = $db_conn->prepare(
      "SELECT t.tutorId FROM termine t
      INNER JOIN ratsuchende rs ON t.rsId = rs.rsId
      WHERE rs.email = ? AND t.lastAccessed > '$max_last_signup_date'"
    );
    $stmt->bind_param("s", $rsInfo['email']);
    $stmt->execute();
    $alreadyRegistered = mysqli_fetch_assoc($stmt->get_result());

    if ($alreadyRegistered) {
      echo json_encode([
          "success" => 0,
          "msg" => "Du hast in den letzten ".$DAYS_BETWEEN_REGISTRATIONS." Tagen bereits eine Beratung gebucht. Innerhalb dieser Frist von ".$DAYS_BETWEEN_REGISTRATIONS." Tagen seit deiner letzten Buchung kannst du keine neue Beratung buchen. Bei einer dringenden Frage kannst du gern in die offene Sprechstunde kommen."
      ]);
      die();
    } else {
      $stmt->close();
    }
  }

  function unpackCheckboxDict($checkboxDict) {
    $values = [];
    foreach ($checkboxDict as $key => $value) {
      if ($value) {
        array_push($values, $key);
      }
    }
    return implode("_", $values);
  }

  $columns = array();
  $values = array();
  //$stmt = $db_conn->prepare("INSERT INTO ratsuchende (?) VALUES (?)");
  // instead: associative array.keys as first (?, ?, ...) list, values as second
  $col_count = 0;
  foreach ($rsInfo as $column => $value) {
    array_push($columns, $column);
    $col_count += 1;
    if (is_object($value)) {
      $value = unpackCheckboxDict($value);
    }
    array_push($values, $value);
  }

  $sql = "INSERT INTO ratsuchende (bookedTypeId, bookedFormat, " . implode(', ', $columns) . ") ";
  $sql .= "VALUES (?, ?, " . implode(', ', array_fill(0, $col_count, "?")) . ")";

  $stmt = $db_conn->prepare($sql);
  $stmt->bind_param("is" . implode(array_fill(0, $col_count, 's')), $consultationType, $format, ...$values);
  $stmt->execute();

  if ($stmt->error) {
    echo json_encode([
        "success" => 0,
        "msg" => "Beim Eintragen des Termins ist ein Fehler aufgetreten.",
        "err" => $stmt->error
    ]);
    die();
  }

  $rsId = $db_conn->insert_id;
  $stmt->close();

  $stmt = $db_conn->prepare("UPDATE `termine` SET `available` = 0, `rsId` = ?
    WHERE `terminId` = ?");

  $stmt->bind_param("ii", $rsId, $appointmentId);

  $stmt->execute();

  if ($stmt->error) {
    echo json_encode([
        "success" => 0,
        "msg" => "Der Termin konnte nicht in die Datenbank eingetragen werden."
    ]);
  } else {
    $stmt->close();

    $stmt = $db_conn->prepare(
      "SELECT email, firstName, mailText FROM peerTutors WHERE ptId=?"
    );
    $stmt->bind_param("i", $tutorId);
    $stmt->execute();
    $pt_mail_query = mysqli_fetch_assoc($stmt->get_result());
    $pt_mail_address = $pt_mail_query["email"];
    $pt_name = $pt_mail_query["firstName"];
    $pt_mail_text = $pt_mail_query["mailText"];
    $rs_email = $rsInfo['email'];
    $rs_mail_link = '<a href="mailto:'.$rsInfo['email'].'">'.$rsInfo['email'].'</a>';
    $rs_first_name = $rsInfo['first_name'];
    $rs_last_name =  $rsInfo['last_name'];

    list($year, $month, $day) = explode("-", $datum);

    $pt_mail_subject = "Anmeldung Beratung am ($day.$month., $time Uhr)";
    $pt_mail_content = "
      <p>Hallo $pt_name,</p>
      dein Beratungstermin am <strong>$day.$month.$year von $time Uhr</strong> wurde gerade von $rs_first_name $rs_last_name reserviert.
      Du erreichst ihn*sie unter ".$rs_mail_link.".</p>
      <p>
      ";

    $pt_mail_content .= "<strong>Ausgewähltes Format: </strong>";
    switch ($format) {
      case 'digital':
        $pt_mail_content .= 'Online<br>';
        break;
      case 'analogue':
        $pt_mail_content .= 'In Präsenz<br>';
        break;
      default:
        $pt_mail_content .= 'Keine Präferenz<br>';
        break;
    }
    $pt_mail_content .= "</p>";

    if (isset($attachments)) {
      $pt_mail_content .= "<p>Im Anhang findest du die Dokumente der*des Ratsuchenden.</p>";
    }

    $pt_mail_content .= '<p>Weitere Informationen und Verwaltungsoptionen findest du im Beratungskalender. Viel Spaß bei der Beratung!</p>';
    $pt_mail_content_plain = "Hallo $pt_name,\n\neiner deiner Beratungstermine wurde gerade reserviert.\nTermin: $day.$month.$year von $time Uhr.\nRS-Mail: $rs_email \nWeitere Informationen findest du im Beratungskalender.";

    // if set in config.php, create .ical file
    $ical = null;
    if ($SEND_CAL_INVITE) {
      $uid = uniqid();
      $timestamp = date('Ymd\THis', time());
      // time received from client has form "HH:MM - HH:MM", needs to be "HHMM00"
      list($from_time, $to_time) = explode("-", $time);
      // e.g. 20231115T140000
      $ical_date = str_replace('-', '', $datum);
      $ical_from = $ical_date.'T'.str_replace(':', '', trim($from_time)).'00';
      $ical_to = $ical_date.'T'.str_replace(':', '', trim($to_time)).'00';

      $ical = "BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//www.uni-konstanz.de//Online Consultation Planner
CALSCALE:GREGORIAN
BEGIN:VTIMEZONE
TZID:Europe/Berlin
LAST-MODIFIED:$timestamp
TZURL:https://www.tzurl.org/zoneinfo-outlook/Europe/Berlin
X-LIC-LOCATION:Europe/Berlin
BEGIN:DAYLIGHT
TZNAME:CEST
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
DTSTART:19700329T020000
RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU
END:DAYLIGHT
BEGIN:STANDARD
TZNAME:CET
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
DTSTART:19701025T030000
RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
DTSTAMP:$timestamp
UID:$uid
DTSTART;TZID=Europe/Berlin:$ical_from
DTEND;TZID=Europe/Berlin:$ical_to
SUMMARY:Beratungstermin am $day.$month., $time Uhr
DESCRIPTION:Eine Beratung mit $rs_first_name $rs_last_name ($rs_email).
END:VEVENT
END:VCALENDAR";
    }

    $mail_success = send_sz_mail($pt_mail_address, $pt_mail_subject, $pt_mail_content, $pt_mail_content_plain, $attachments, $ical);

    if ($mail_success !== 'success') {
      echo json_encode([
          "success" => 0,
          "msg" => 'Der Termin wurde eingetragen, aber die Benachrichtigungs-Mail an deine*n Berater*in konnte nicht erfolgreich verschickt werden. Bitte kontaktiere deine*n Berater*in selbst unter '.$pt_mail_address.'. Vielen Dank für dein Verständnis.'
      ]);
    } else {
      // obtain confirmation mail text
      $get_rs_mail_content = "SELECT confirmation_mail FROM consultationTypes WHERE id=$consultationType";
      $res = mysqli_query($db_conn, $get_rs_mail_content);
      $row = mysqli_fetch_assoc($res);
      $rs_mail_content = $row['confirmation_mail'];
      if (isset($pt_mail_text)) {
        $rs_mail_content .= "\n\n";
        $rs_mail_content .= $pt_mail_text;
      }
      // make mail non-empty so it is still sent (edge-case)
      if (!isset($rs_mail_content) || $rs_mail_content === "") {
        $rs_mail_content = "\n";
      }

      $rs_mail_subject = "Beratung am $day.$month.$year von $time Uhr";

      $rs_mail_success = send_sz_mail($rs_email, $rs_mail_subject, null, $rs_mail_content, null);
      //TODO: Anmeldung in dem Fall löschen und zum Korrigieren von mail adresse aufrufen
      // -> sql transaction
      if ($rs_mail_success !== 'success') {
        echo json_encode([
            "success" => 0,
            "msg" => 'Der Termin wurde erfolgreich eingetragen, aber wir konnten keine Benachrichtigung an deine E-Mail-Adresse schicken. Bitte kontaktiere deine*n Berater*in unter <a href="mailto:'.$pt_mail_address.'">'.$pt_mail_address.'</a>, um sicherzustellen, dass du erreicht werden kannst. Vielen Dank für dein Verständnis.'
        ]);
      } else {
        echo json_encode([
            "success" => 1,
            "msg" => "Termin bestätigt."
        ]);
      }
    }
  }

} else {
  echo json_encode([
      "success" => 0,
      "msg" => "Keine Termindaten erhalten."
  ]);
}
