import React from 'react';

import Day from '../Day/Day';
import styles from '../../../Week/Days/Days.module.css';

const days = props => {
  const dayList = props.days.map(day => (
    <Day
      key={day}
      weekday={day}
      selectedSlots={props.selectedSlots}
      onSlotClick={props.onSlotClick} />
  ));

  return (
    <div className={styles.Days}>
      {dayList}
    </div>
  );
};

export default days;
