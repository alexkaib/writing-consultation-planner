import React from 'react';

import styles from '../../../../Week/DayButtons/DayButton/DayButton.module.css';

const dayButton = props => (
  <div className={styles.DayButton} >
    <p>{props.buttonLabel}</p>
  </div>
);

export default dayButton;
