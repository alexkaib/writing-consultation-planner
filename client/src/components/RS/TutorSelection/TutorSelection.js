import React from 'react';

import styles from './TutorSelection.module.css';

const tutorSelection = props => {
  const tutorOptions = props.availableTutors.map(tutor => (
    <option key={tutor.ptId} value={tutor.ptId}>
      {tutor.name} - {tutor.subjects}
    </option>
  ));

  return (
    <div className={styles.Container}>
      <p>{props.infoText}</p>
      <select
        onChange={props.onTutorClick}
        value={props.currentTutor}>
        {props.genericTutor}
        {tutorOptions}
      </select>
    </div>
  );
}

export default tutorSelection;
