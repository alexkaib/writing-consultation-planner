import React from 'react';

import Day from '../Day/Day';
import styles from './Days.module.css';

const days = props => {
  const dayList = props.dates.map(date => (
    <Day
      key={date}
      weekday={date}
      availableSlots={props.availableSlots}
      onSlotClick={props.onSlotClick} />
  ));

  return (
    <div className={styles.Days}>
      {dayList}
    </div>
  );
};

export default days;
