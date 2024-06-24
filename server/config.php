<?php
// key to be used for server-client encryption
$secret_key = 'YourJWTKeyHere';

// displayed e-mail
$institution_email_address = 'your@email.com'; // this address will be displayed and replied to
$institution_email_name = 'Your Institution Name';
// smtp configuration
$SENDER_ADDRESS = 'your@email.com'; // this address will be used to send e-mails and must correspond to the SMTP user
$SMTP_HOST = 'smpt.example.com';
$SMTP_PORT = 587;
$SMTP_USER = 'username';
$SMTP_PW = 'YourMailPasswordHere';


// WARNING: Ical integration might not work for outlook clients
$SEND_CAL_INVITE = false;
$SEND_CONSULTANT_INFO = false;

// uncomment for e-mail validation (only concerns the consultee's e-mail address on registration)
//$REQUIRED_MAIL_ENDING = 'exclusive-domain.de';

// uncomment to set an amount of days that need to pass before being able to register with the same e-mail address
$DAYS_BETWEEN_REGISTRATIONS = 14;

$ACCEPTED_FILE_TYPES = array(
  'text/plain',
  'application/rtf',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.oasis.opendocument.text'
);

$db_url ="127.0.0.1:8889";
$db_name = "consultation_planner";
$db_user = "root";
$db_pw = "root";
