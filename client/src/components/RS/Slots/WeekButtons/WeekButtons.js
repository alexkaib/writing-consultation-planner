import React from 'react';

import styles from './WeekButtons.module.css';

const weekButtons = props => (
  <div className={styles.WeekButtons}>
    <p
      className={props.prevAvailable?styles.available:styles.unavailable}
      onClick={props.onPrevClick}>
        <i className={styles.left}></i> Vorherige Woche
    </p>
    <p
      className={props.nextAvailable?styles.available:styles.unavailable}
      onClick={props.onNextClick}>
        Nächste Woche <i className={styles.right}></i>
    </p>
  </div>
);

export default weekButtons;
