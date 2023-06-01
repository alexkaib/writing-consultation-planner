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

        $search_term = $post_data->searchTerm;
        $search_term = mysqli_real_escape_string($db_conn, $search_term);
        $fachbereich = $post_data->fachbereich;
        $genre = $post_data->genre;

        $query = "SELECT t.terminId, t.datum, t.timeslot, t.rsId, t.protocolId
          FROM termine t
          INNER JOIN ratsuchende rs ON (rs.rsId = t.rsId)
          INNER JOIN protocols p ON (p.protocolId = t.protocolId)
          WHERE t.archived = '1'";

        if ($search_term) {
          $query .= " AND p.Verlauf LIKE '%$search_term%'";
        }

        if (!($fachbereich === 'na')) {
          $query .= " AND rs.fachbereich='$fachbereich'";
        }

        if (!($genre === 'na')) {
          $query .= " AND rs.genre='$genre'";
        }

        $query_result = mysqli_query($db_conn, $query);

        if ($query_result) {
          $res = mysqli_fetch_all($query_result, MYSQLI_ASSOC);
          echo json_encode(array(
              "success" => 1,
              "appointments" => $res
          ));
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
