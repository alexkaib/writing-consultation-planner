import React from 'react';

import DayButton from './DayButton/DayButton';
import styles from '../../../Week/DayButtons/DayButtons.module.css';

const dayButtons = props => {
  let days = ["Mo", "Di", "Mi", "Do", "Fr"];
  if (window.matchMedia("(min-width: 800px)").matches) {
    days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  };
  const buttons = days.map(day => <DayButton key={day} buttonLabel={day} />);

  return (
    <div className={styles.DayButtons}>
      {buttons}
    </div>
  )
};

export default dayButtons;
