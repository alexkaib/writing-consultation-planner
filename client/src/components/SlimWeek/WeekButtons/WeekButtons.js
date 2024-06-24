import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import styles from './WeekButtons.module.css';

const weekButtons = props => (
  <div className={styles.WeekButtons}>
    <button
      className={props.prevAvailable?styles.available:styles.unavailable}
      onClick={props.onPrevClick}>
        <i className={styles.left}></i> {langStrings[props.language].prev_week}
    </button>
    <button
      className={props.nextAvailable?styles.available:styles.unavailable}
      onClick={props.onNextClick}>
        {langStrings[props.language].next_week} <i className={styles.right}></i>
    </button>
  </div>
);

export default weekButtons;
