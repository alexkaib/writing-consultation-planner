import React from 'react';

import styles from './TeamSlot.module.css';

const teamSlot = props => {
  const dateString = props.date.split('-').reverse().join('.');
  const timeString = props.time + ':00 Uhr';
  let typeString = 'Schreibberatung (Deutsch)';
  switch (props.type) {
    case 'student_english':
      typeString = 'Schreibberatung (Englisch)';
      break;
    case 'phd':
      typeString = 'Promotionsberatung (Deutsch)';
      break;
    case 'phd_english':
      typeString = 'Promotionsberatung (Englisch)';
      break;
    case 'student_stem':
      typeString = 'Schreibberatung (MINT)';
      break;
    case 'research':
      typeString = 'Rechercheberatung';
      break;
    case 'textfeedback':
      typeString = 'Textfeedback per E-Mail';
      break;
    default:
      break;
  }
  const formatString = props.format === 'digital' ? 'Online' :
    (props.format === 'analogue' ? 'In Präsenz' : 'Keine Angabe');

  return (
  <button className={styles.Slot} onClick={() => props.onAppointmentClick(props.terminId)}>
    <h3><strong>{dateString} um {timeString}</strong></h3>
    <em>{typeString}</em>
    <p>
      Format: {formatString} <br></br>
      Berater*in: {props.tutor}
    </p>
  </button>
)};

export default teamSlot;
