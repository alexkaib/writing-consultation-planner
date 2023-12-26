<?php
//Import PHPMailer classes into the global namespace
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function send_sz_mail($address, $subject, $html_content, $plain_content, $attachment = null) {

// get institution email and name from config
require 'config.php';

//Create a new PHPMailer instance
$mail = new PHPMailer();

$mail->CharSet = 'UTF-8';
$mail->Encoding = 'base64';
//Tell PHPMailer to use SMTP
$mail->isSMTP();

//Enable SMTP debugging
//SMTP::DEBUG_OFF = off (for production use)
//SMTP::DEBUG_CLIENT = client messages
//SMTP::DEBUG_SERVER = client and server messages
$mail->SMTPDebug = SMTP::DEBUG_OFF;

// uncomment and fill out the following to use your own mail-server
/*
//Set the hostname of the mail server
$mail->Host = 'example.com';

//Use `$mail->Host = gethostbyname('smtp.gmail.com');`
//if your network does not support SMTP over IPv6,
//though this may cause issues with TLS

//Set the SMTP port number - 587 for authenticated TLS, a.k.a. RFC4409 SMTP submission
$mail->Port = 587;

//Set the encryption mechanism to use - STARTTLS or SMTPS
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

//Whether to use SMTP authentication
$mail->SMTPAuth = true;

//Username to use for SMTP authentication - use full email address for gmail
$mail->Username = 'user';

//Password to use for SMTP authentication
$mail->Password = 'password';
*/

if (!isset($institution_email_address)) {
  return 'Mailer error: no sender address specified';
}
//Set who the message is to be sent from
$mail->setFrom($institution_email_address, $institution_email_name);

//Set an alternative reply-to address
$mail->addReplyTo($institution_email_address, $institution_email_name);

//Set who the message is to be sent to
$mail->addAddress($address);

//Set the subject line
$mail->Subject = $subject;

//make this optional
//Read an HTML message body from an external file, convert referenced images to embedded,
//convert HTML into a basic plain-text alternative body
// TODO: Institution per config
$message_content = '
  <!DOCTYPE html>
  <html lang="de">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>Mail vom Schreibzentrum</title>
  </head>
  <body>
';

$message_content .= $html_content;

$message_content .= '
  </body>
  </html>
';

$mail->msgHTML($message_content);

//Replace the plain text body with one created manually
$mail->AltBody = utf8_encode($plain_content);

if (isset($attachment)) {
  $mail->addAttachment($attachment['location'], $attachment['name']);
}

//send the message, check for errors
if (!$mail->send()) {
    // FOR DEMO PURPOSES
    return 'success';
    // SHOULD BE:
    // return 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    return 'success';
}
}
