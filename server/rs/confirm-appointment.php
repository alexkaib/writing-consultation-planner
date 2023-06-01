<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Acces-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require '../db_connection.php';

$post_data = json_decode($_POST['payload']);

//checks if there is valid text file and sets mail-attachment variable accordingly
if (isset($_FILES['textfile'])) {
  $allowed_types = array(
    'text/plain',
    'application/rtf',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.oasis.opendocument.text'
  );
  $filelocation = $_FILES['textfile']['tmp_name'];
  $filename = $_FILES['textfile']['name'];
  $mime_type = mime_content_type($filelocation);

  if (!in_array($mime_type, $allowed_types)) {
    echo json_encode([
        "success" => 0,
        "msg" => "Falsches Dateiformat."
    ]);
  } else {
    if ($_FILES['textfile']['size'] > 10000000) {
      echo json_encode([
          "success" => 0,
          "msg" => "Datei ist zu groß."
      ]);
    } else {
      $pt_attachment = ['location' => $filelocation, 'name' => $filename];
    }
  }
} else {
  $pt_attachment = null;
}

//checks registration info, writes info to database and sends e-mail to pt and rs
if (isset($post_data->date)) {
  $appointmentId = (int) $post_data->appointmentId;
  $datum = $post_data->date;
  $time = $post_data->time;
  $tutorId = (int) $post_data->ptId;
  $consultationType = $post_data->consultationType;
  $format = $post_data->format;
  $termsAccepted = (int) $post_data->termsAccepted;
  $rsInfo = $post_data->rsInfo;

  //checks if e-mail-address was used recently to sign up
  $max_last_signup_date = date("Y-m-d H:i:s", strtotime('- 14 days'));

  $stmt = $db_conn->prepare(
    "SELECT t.tutorId FROM termine t
    INNER JOIN ratsuchende rs ON t.rsId = rs.rsId
    WHERE rs.email = ? AND t.lastAccessed > '$max_last_signup_date'"
  );
  $stmt->bind_param("s", $rsInfo->email);
  $stmt->execute();
  $alreadyRegistered = mysqli_fetch_assoc($stmt->get_result());

  if ($alreadyRegistered) {
    $pt_id = $alreadyRegistered["tutorId"];
    $pt_mail_query = mysqli_fetch_assoc(mysqli_query($db_conn, "SELECT email FROM peerTutors WHERE ptId='$pt_id'"));
    $pt_mail = $pt_mail_query["email"];
    echo json_encode([
        "success" => 0,
        "msg" => "Es sieht so aus, als ob du vor Kurzem bereits einen Termin bei uns ausgemacht hättest. Bitte kontaktiere deine*n Berater*in (".$pt_mail."), falls du den Termin absagen möchtest. Falls du mehr als eine Beratung benötigst, kannst du mit ihr*ihm eine Folgeberatung ausmachen."
    ]);
  } else {
  $stmt->close();
  // TODO: save as json object in db
  function unpackCheckboxDict($checkboxDict) {
    $values = [];
    foreach ($checkboxDict as $key => $value) {
      if ($value) {
        array_push($values, $key);
      }
    }
    return implode("_", $values);
  }

  $reachedBy = unpackCheckboxDict($rsInfo->reachedBy);

  if ($rsInfo->erstStudierend === 'Keine Angabe') {
    $rsInfo->erstStudierend = null;
  }

  $terminReasons = unpackCheckboxDict($rsInfo->terminReasons);

  $stmt = $db_conn->prepare("INSERT INTO ratsuchende (
      firstName,
      lastName,
      email,
      datenschutzBestaetigt,
      angemeldetAls,
      format,
      semester,
      abschluss,
      fachbereich,
      fach,
      deutschAls,
      erstStudierend,
      gender,
      elternHerkunft,
      terminReasons,
      genre,
      reachedBy,
      commentField,
      otherTerminReasons,
      topic
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

  $stmt->bind_param(
    "sssissssississssssss",
    $rsInfo->firstName,
    $rsInfo->lastName,
    $rsInfo->email,
    $termsAccepted,
    $consultationType,
    $format,
    $rsInfo->semester,
    $rsInfo->abschluss,
    $rsInfo->fachbereich,
    $rsInfo->fach,
    $rsInfo->deutschAls,
    $rsInfo->erstStudierend,
    $rsInfo->gender,
    $rsInfo->elternHerkunft,
    $terminReasons,
    $rsInfo->genre,
    $reachedBy,
    $rsInfo->comment,
    $rsInfo->otherReasons,
    $rsInfo->topic
  );

  $stmt->execute();

  if ($stmt->error) {
    echo json_encode([
        "success" => 0,
        "msg" => "Beim Eintragen des Termins ist ein Fehler aufgetreten."
    ]);
  } else {
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
        "SELECT email, firstName FROM peerTutors WHERE ptId=?"
      );
      $stmt->bind_param("i", $tutorId);
      $stmt->execute();
      $pt_mail_query = mysqli_fetch_assoc($stmt->get_result());
      $pt_mail_address = $pt_mail_query["email"];
      $pt_name = $pt_mail_query["firstName"];
      $rs_mail_link = '<a href="mailto:'.$rsInfo->email.'">'.$rsInfo->email.'</a>';
      list($year, $month, $day) = explode("-", $datum);

      if ($consultationType === 'research') {
        $pt_mail_subject = "Anmeldung Rechercheberatung ($day.$month., $time:00 Uhr)";
        $pt_mail_content = "
          <p>Sehr geehrtes Team der $pt_name,</p>
          Ihr Termin zur Rechercheberatung am <strong>$day.$month.$year um $time:00 Uhr</strong> wurde gerade von $rsInfo->firstName $rsInfo->lastName reserviert.
          Sie erreichen ihn*sie unter ".$rs_mail_link.".</p>
          <p>
          <strong>Angefragte Beratungsform: </strong>";
      } else {
        if ($consultationType === 'methods') {
          $pt_mail_subject = "Anmeldung Methodenberatung ($day.$month., $time:00 Uhr)";
        } else {
          $pt_mail_subject = "Anmeldung Schreibberatung ($day.$month., $time:00 Uhr)";
        }
        $pt_mail_content = "
          <p>Hallo $pt_name,</p>
          dein Beratungstermin am <strong>$day.$month.$year um $time:00 Uhr</strong> wurde gerade von $rsInfo->firstName $rsInfo->lastName reserviert.
          Du erreichst ihn*sie unter ".$rs_mail_link.".</p>
          <p>
          <strong>Angefragte Beratungsform: </strong>";
      }

      switch ($consultationType) {
        //these need to correspond to consultation types in TypeSelector.js
        case 'student':
          $pt_mail_content .= 'Schreibberatung<br>';
          break;
        case 'student_english':
          $pt_mail_content .= 'Englischsprachige Schreibberatung<br>';
          break;
        case 'germanistik':
          $pt_mail_content .= 'Germanistische Schreibberatung<br>';
          break;
        case 'ethnologie':
          $pt_mail_content .= 'Ethnologische Schreibberatung<br>';
          break;
        case 'textfeedback':
          $pt_mail_content .= 'Textfeedback per E-Mail<br>';
          break;
        case 'phd':
          $pt_mail_content .= 'Promotionsberatung<br>';
          break;
        case 'phd_english':
          $pt_mail_content .= 'Englischsprachige Promotionsberatung<br>';
          break;
        case 'research':
          $pt_mail_content .= 'Rechercheberatung<br>';
          break;
        case 'methods':
          $pt_mail_content .= 'Methodenberatung<br>';
          break;
        default:
          $pt_mail_content .= 'Keine Angabe<br>';
          break;
      }

      $pt_mail_content .= "<strong>Format: </strong>";
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

      $pt_mail_content .= "<strong>Fach: </strong>$rsInfo->fach<br>";
      $pt_mail_content .= "<strong>Abschluss: </strong>$rsInfo->abschluss<br>";
      $pt_mail_content .= "<strong>Semester: </strong>$rsInfo->semester<br>";

      if ($rsInfo->genre) {
        $pt_mail_content .= "<strong>Textsorte: </strong>$rsInfo->genre<br>";
      }

      if ($rsInfo->topic) {
        $pt_mail_content .= "<strong>Thema/Fragestellung: </strong>$rsInfo->topic<br>";
      }

      if ($rsInfo->comment) {
        $pt_mail_content .= "<strong>Kommentar: </strong>$rsInfo->comment<br>";
      }

      $pt_mail_content .= "</p>";

      if (isset($pt_attachment)) {
        if ($consultationType === 'research') {
          $pt_mail_content .= "<p>Im Anhang finden Sie den Text der*des Ratsuchenden.</p>";
        } else {
          $pt_mail_content .= "<p>Im Anhang findest du den Text der*des Ratsuchenden.</p>";
        }
      }

      if ($consultationType === 'research') {
        $pt_mail_content .= '<p>Weitere Informationen und Verwaltungsoptionen finden Sie unter <a href="https://sz.uni-frankfurt.de">sz.uni-frankfurt.de</a>.</p><p><em>Diese E-Mail wurde automatisch generiert. Bei Fragen wenden Sie sich bitte an Alexander Kaib (<a href="mailto:akaib@em.uni-frankfurt.de">akaib@em.uni-frankfurt.de</a>).</em></p>';
        $pt_mail_content_plain = "Sehr geehrtes Team der $pt_name,\n\neiner Ihrer Termine zur Rechercheberatung wurde gerade reserviert.\nTermin: $day.$month.$year um $time:00 Uhr.\nE-Mail der*des Ratsuchenden: $rsInfo->email\nWeitere Informationen finden Sie unter sz.uni-frankfurt.de.\n\nDiese E-Mail wurde automatisch generiert. Bei Fragen wenden Sie sich bitte an: akaib@em.uni-frankfurt.de";
      } else {
        $pt_mail_content .= '<p>Weitere Informationen und Verwaltungsoptionen findest du unter <a href="https://sz.uni-frankfurt.de">sz.uni-frankfurt.de</a>. Viel Spaß bei der Beratung!</p>';
        $pt_mail_content_plain = "Hallo $pt_name,\n\neiner deiner Schreibberatungstermine wurde gerade reserviert.\nTermin: $day.$month.$year um $time:00 Uhr.\nRS-Mail: $rsInfo->email\nWeitere Informationen findest du unter sz.uni-frankfurt.de.";
      }

      require '../send_sz_mail.php';

      $mail_success = send_sz_mail($pt_mail_address, $pt_mail_subject, $pt_mail_content, $pt_mail_content_plain, $pt_attachment);

      if ($mail_success !== 'success') {
        echo json_encode([
            "success" => 0,
            "msg" => 'Der Termin wurde eingetragen, aber die Benachrichtigungs-Mail an deine*n Berater*in konnte nicht erfolgreich verschickt werden. Bitte kontaktiere deine*n Berater*in selbst unter '.$pt_mail_address.'. Vielen Dank für dein Verständnis.'
        ]);
      } else {
        $rs_mail_content = "<p>Hallo $rsInfo->firstName $rsInfo->lastName,</p><p>vielen Dank für Ihre Anmeldung zur Recherche- bzw. Schreibberatung. Hiermit bestätigen wir Ihren Termin am $day.$month.$year um $time:00 Uhr. Vor dem Termin wird sich Ihr*e Berater*in mit weiteren Informationen zum Ablauf der Beratung bei Ihnen melden. Falls Sie selbst im Voraus Kontakt aufnehmen möchten, erreichen Sie Ihre*n Berater*in unter $pt_mail_address.</p><p>Mit freundlichen Grüßen,<br>Das Team des Schreibzentrums";
        $rs_mail_content_plain = "Hallo $rsInfo->firstName $rsInfo->lastName,\n\nvielen Dank für Ihre Anmeldung zur Recherche- bzw. Schreibberatung. Hiermit bestätigen wir Ihren Termin am $day.$month.$year um $time:00 Uhr. Vor dem Termin wird sich Ihr*e Berater*in mit weiteren Informationen zum Ablauf der Beratung bei Ihnen melden. Falls Sie selbst im Voraus Kontakt aufnehmen möchten, erreichen Sie Ihre*n Berater*in unter $pt_mail_address.\n\nMit freundlichen Grüßen,\nDas Team des Schreibzentrums";

        if ($consultationType === 'research') {
          $rs_mail_subject = 'Anmeldung zur Rechercheberatung';
        } else if ($consultationType === 'methods') {
          $rs_mail_subject = 'Anmeldung zur Methodenberatung';
        } else {
          $rs_mail_subject = 'Anmeldung zur Schreibberung';
        }

        $rs_mail_success = send_sz_mail($rsInfo->email, $rs_mail_subject, $rs_mail_content, $rs_mail_content_plain, null);
        //TODO: Anmeldung in dem Fall löschen und zum Korrigieren von mail adresse aufrufen
        // -> sql transaction
        if ($rs_mail_success !== 'success') {
          echo json_encode([
              "success" => 0,
              "msg" => 'Der Termin wurde erfolgreich eingetragen, aber wir konnten keine Benachrichtigung an deine E-Mail-Adresse schicken. Bitte kontaktiere deine*n Berater*in unter <a href="mailto:"'.$pt_mail_address.'">'.$pt_mail_address.'</a>, um sicherzustellen, dass du erreicht werden kannst. Vielen Dank für dein Verständnis.'
          ]);
        } else {
          echo json_encode([
              "success" => 1,
              "msg" => "Termin bestätigt."
          ]);
        }
      }
    }
  }
}

} else {
  echo json_encode([
      "success" => 0,
      "msg" => "Keine Termindaten erhalten."
  ]);
}
