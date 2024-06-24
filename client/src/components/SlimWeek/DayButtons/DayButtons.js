import React from 'react';

import DayButton from './DayButton/DayButton';
import styles from './DayButtons.module.css';

const dayButtons = props => {
  let days = ["Mo", "Di", "Mi", "Do", "Fr"];
  if (window.matchMedia("(min-width: 900px)").matches) {
    days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  };

  // make this conditional on props.dates existing, so it's reusable for Slot Setter
  const displayedDates = props.dates.map(date => (
    date.split('-')[2] + "." + date.split('-')[1] + "."
  ));
  const buttons = days.map((day, i) => <DayButton key={day} buttonLabel={day} date={displayedDates[i]} />);

  return (
    <div className={styles.DayButtons}>
      {buttons}
    </div>
  )
};

export default dayButtons;
