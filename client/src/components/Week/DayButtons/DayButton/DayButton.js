import React from 'react';

import styles from './DayButton.module.css';

const dayButton = props => (
  <div className={styles.DayButton} >
    <p>{props.buttonLabel}</p>
    <p>{props.date}</p>
  </div>
);

export default dayButton;
