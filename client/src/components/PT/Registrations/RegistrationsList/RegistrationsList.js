import React from 'react';

import Registration from '../Registration/Registration';
import styles from './RegistrationsList.module.css';

const registrationsList = (props) => {
  const registrations = props.registeredAppointments.map(registration => (
    <Registration
      key={registration.terminId}
      terminId={registration.terminId}
      date={registration.date}
      time={registration.time}
      rsId={registration.rsId}
      rsFirstName={registration.rsFirstName}
      rsLastName={registration.rsLastName}
      rsEmail={registration.rsEmail}
      evaluationSent={registration.evaluationSent}
      roomReserved={registration.roomReserved}
      followUpId={registration.followUpId}
      protocolId={registration.protocolId}
      highlighted={registration.highlighted}
      onIconClick={props.onIconClick}
      ptRole={props.ptRole} />
  ));

  return (
    <div className={styles.RegistrationsList}>
      {registrations}
    </div>
  );
}

export default registrationsList;
