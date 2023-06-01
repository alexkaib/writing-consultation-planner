<?php

header("Acces-Control-Allow-Origin: *");
header("Acces-Control-Allow-Headers: access");
header("Acces-Control-Allow-Methods: GET");
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

        $protocolId = $post_data->protocolId;

        $protocol_query = mysqli_query($db_conn, "SELECT * FROM `protocols` WHERE `protocolId` = '$protocolId'");

        if ($protocol_query) {
          // generate pdf
          $current_date = date("d.m.Y");
          $pdfAuthor = "Schreibzentrum";
          $pdfName = "Schreibberatungsprotokoll_".$protocolId.".pdf";

          $protocol = mysqli_fetch_assoc($protocol_query);
          $schwerpunkt = $protocol['Beratungsschwerpunkt'];
          $schreibphase = $protocol['Schreibphase'];
          $verlauf = $protocol['Verlauf'];
          $reflexion_allgemein = $protocol['ReflexionAllgemein'];
          $reflexion_methode = $protocol['ReflexionMethode'];
          $reflexion_persoenlich = $protocol['ReflexionPersoenlich'];
          $arbeitsvereinbarung = $protocol['Arbeitsvereinbarung'];

          $html = '
          <table cellpadding="5" cellspacing="0" style="width: 100%; ">
          	<tr>
              <td>
                <h1>Schreibberatungsprotokoll</h1>
              </td>
          	   <td style="text-align: right">
          			Protokoll-ID: '.$protocolId.'
          		</td>
          	</tr>
          </table>
          <br><br>';

          $html .= '<h2>Beratungsinformationen</h2>';

          if ($schwerpunkt) {
          	$html .= '<h3>Beratungsschwerpunkte</h3>';
          	$html .= implode(", ", explode("_", $schwerpunkt));
          }

          if ($schreibphase) {
          	$html .= '<h3>Schreibphase</h3>';
          	$html .= implode(", ", explode("_", $schreibphase));
          }

          $html .= '<br><br><h2>Verlauf</h2>';

          if ($verlauf) {
          	$html .= nl2br($verlauf);
          }

          $html .= '<br><br><h2>Reflexion</h2>';

          if ($reflexion_allgemein) {
          	$html .= '<h3>1. Allgemein</h3>';
          	$html .= nl2br($reflexion_allgemein);
          }

          if ($reflexion_methode) {
          	$html .= '<h3>2. Methoden</h3>';
          	$html .= nl2br($reflexion_methode);
          }

          if ($reflexion_persoenlich) {
          	$html .= '<h3>3. Ich als Berater*in</h3>';
          	$html .= nl2br($reflexion_persoenlich);
          }

          if ($arbeitsvereinbarung) {
          	$html .= '<h3>Arbeitsvereinbarung</h3>';
          	$html .= nl2br($arbeitsvereinbarung);
          }

          //////////////////////////// Erzeugung des PDF Dokuments \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

          // TCPDF Library laden
          require_once('../vendor/tecnickcom/tcpdf/tcpdf.php');

          // Erstellung des PDF Dokuments
          $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

          // Dokumenteninformationen
          $pdf->SetCreator(PDF_CREATOR);
          $pdf->SetAuthor($pdfAuthor);
          $pdf->SetTitle('Beratungsprotokoll '.$protocolId);
          $pdf->SetSubject('Beratungsprotokoll '.$protocolId);


          // Header und Footer Informationen
          $pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
          $pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

          // Auswahl des Font
          $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

          // Auswahl der MArgins
          $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
          $pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
          $pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

          // Automatisches Autobreak der Seiten
          $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

          // Image Scale
          $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

          // Schriftart
          $pdf->SetFont('dejavusans', '', 10);

          // Neue Seite
          $pdf->AddPage();

          // Fügt den HTML Code in das PDF Dokument ein
          $pdf->writeHTML($html, true, false, true, false, '');

          //Ausgabe der PDF

          //Variante 1: PDF direkt an den Benutzer senden:
          ob_end_clean();
          $pdf->Output($pdfName, 'I');

        } else {
          echo json_encode(array(
              "success" => 0,
              "msg" => "Datenbankabfrage nicht erfolgreich."
            ));
        }

    }catch (Exception $e){

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
