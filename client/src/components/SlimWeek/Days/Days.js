import React from 'react';

import Day from '../Day/Day';
import styles from './Days.module.css';
import langStrings from '../../../lang/languageStrings.json';

const days = props => {
  const dayNames = [
    "",
    langStrings[props.language].weekday_1,
    langStrings[props.language].weekday_2,
    langStrings[props.language].weekday_3,
    langStrings[props.language].weekday_4,
    langStrings[props.language].weekday_5
  ];
  const dayList = props.days.map(day => (
    <Day
      key={day}
      date={day}
      weekday={dayNames[(new Date(day)).getUTCDay()]}
      addNewSlotHandler={props.addNewSlotHandler}
      slots={props.slots.filter(slot => slot.date === day)}
      showSlots={props.expandedDays.includes(day)}
      onSlotClick={props.onSlotClick}
      onDayClick={props.onDayClick}
      language={props.language} />
  ));

  return (
    <div className={styles.Days}>
      {dayList}
    </div>
  );
};

export default days;
