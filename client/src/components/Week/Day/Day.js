import React from 'react';

import Slot from '../Slot/Slot';
import styles from './Day.module.css';

const day = props => {
  let times = ["9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  if (window.matchMedia("(max-width: 900px)").matches) {
    times = times.map(time => time.split(':')[0]);
  };

  const slots = times.map(time => {
    const dateAndTime = props.weekday + "_" + parseInt(time); //parseInt makes sure that both times arrays lead to the same daytime saved in state
    return (
      <Slot
        key={dateAndTime}
        weekday={props.weekday}
        time={time}
        dateAndTime={dateAndTime} //should be of the form int-int to correspond to api
        onSlotClick={props.onSlotClick}
        unavailable={props.availableSlots.map(slot => slot.slot === dateAndTime?slot.available:null).includes(false)}
        highlighted={props.availableSlots.map(slot => slot["slot"]).includes(dateAndTime)}
        disableEmptySlots={props.disableEmptySlots} />
    );
  });

  return (
    <div className={styles.Day}>
      {slots}
    </div>
  );
};

export default day;
