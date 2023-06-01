import React from 'react';

import Slot from '../Slot/Slot';
import styles from '../../../Week/Day/Day.module.css';

const day = props => {
  let times = ["09:00","10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  if (window.matchMedia("(max-width: 700px)").matches) {
    times = ["09","10", "11", "12", "13", "14", "15", "16", "17", "18"];
  };
  const slots = times.map(time => {
    const daytime = props.weekday + "-" + parseInt(time); //parseInt makes sure that both times arrays lead to the same daytime saved in state
    return (
      <Slot
        key={daytime}
        time={time}
        daytime={daytime} //should be of the form int-int
        onSlotClick={props.onSlotClick}
        highlighted={props.selectedSlots.includes(daytime)} />
    );
  });

  return (
    <div className={styles.Day}>
      {slots}
    </div>
  );
};

export default day;
