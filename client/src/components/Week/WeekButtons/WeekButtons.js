import React from 'react';

import styles from './WeekButtons.module.css';

const weekButtons = props => (
  <div className={styles.WeekButtons}>
    <button
      className={props.prevAvailable?styles.available:styles.unavailable}
      onClick={props.onPrevClick}>
        <i className={styles.left}></i> Letzte Woche
    </button>
    <button
      className={props.nextAvailable?styles.available:styles.unavailable}
      onClick={props.onNextClick}>
        Nächste Woche <i className={styles.right}></i>
    </button>
  </div>
);

export default weekButtons;
