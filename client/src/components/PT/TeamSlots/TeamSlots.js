import React from 'react';

import TeamSlot from './TeamSlot/TeamSlot';

import styles from './TeamSlots.module.css';

const teamSlots = (props) => {
  const slots = props.appointments.map(slot => (
    <TeamSlot
      key={slot.terminId}
      terminId={slot.terminId}
      tutor={slot.tutor}
      date={slot.date}
      time={slot.time}
      type={slot.type}
      format={slot.format}
      guestRequested={slot.guestRequested}
      onAppointmentClick={props.onAppointmentClick} />
  ));

  return (
    <div className={styles.Container}>
      {slots.length > 0 ?
        slots :
        <p>Zurzeit gibt es keine vereinbarten Termine.</p>}
    </div>
  );
}

export default teamSlots;
