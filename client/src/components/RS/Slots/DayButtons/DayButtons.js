import React from 'react';

import DayButton from '../../../PT/Slots/DayButtons/DayButton/DayButton';
import styles from '../../../PT/Slots/DayButtons/DayButtons.module.css';

const dayButtons = props => {
  //days should be imported through props, best in long form since shortening is easier
  let days = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"];
  if (window.matchMedia("(max-width: 800px)").matches) {
    const shortDays = days.map(day => day.slice(0, 2));
    days = shortDays;
  };
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
