import React from 'react';

import styles from './Calendar.module.css';
import langStrings from '../../../lang/languageStrings.json';

const calendarDisplayer = (props) => {
  return (
    <div className={styles.Calendar}>
      <h1>{langStrings[props.language]["pt_cal_header"]}</h1>
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
