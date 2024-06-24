import React from 'react';

import styles from './TeamSlot.module.css';

const teamSlot = props => {
  const dateString = props.date.split('-').reverse().join('.');
  const timeString = props.time + ' Uhr';

  const formatString = props.format === 'digital' ? 'Online' :
    (props.format === 'analogue' ? 'In Präsenz' : 'Keine Angabe');

  console.log(props.guestRequested)
  return (
  <button
    className={styles.Slot + " " + (props.guestRequested ? styles.Unavailable : styles.Available)}
    onClick={props.guestRequested ? null : () => props.onAppointmentClick(props.terminId)}>
    <h3><strong>{dateString} von {timeString}</strong></h3>
    {props.guestRequested ? "[Hospitation vergeben]" : "[Für Hospitation offen]"}
    <p>
      Format: {formatString} <br></br>
      Berater*in: {props.tutor}
    </p>
  </button>
)};

export default teamSlot;
