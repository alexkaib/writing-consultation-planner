import React from 'react';

import styles from './Calendar.module.css';

const calendarDisplayer = (props) => {
  return (
    <div className={styles.Calendar}>
      <h1>Angebotene Termine</h1>
      <div className={styles.CalendarContent}>
        <div className={styles.Week}>
          {props.children[0]}
        </div>
        <div className={styles.Options}>
          {props.children[1]}
        </div>
      </div>
    </div>
  );
}

export default calendarDisplayer;
