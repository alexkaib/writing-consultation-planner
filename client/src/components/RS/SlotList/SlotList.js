import React from 'react';

import Button from '../../UI/Button/Button';
import styles from './SlotList.module.css';

const slotList = props => {

  const availableDateTimes = props.availableSlots.map(slot => slot.slot);
  const uniqueDateTimes = [...new Set(availableDateTimes)];
  const sortedDateTimes = uniqueDateTimes.sort()

  const slots = sortedDateTimes.map(slot => {
    const dateAsList = slot.split('_')[0].split('-');
    const time = slot.split('_')[1];
    return (
    <Button
      key={slot}
      buttonHandler={() => props.slotSelectionHandler(slot)}>
      {dateAsList[2]+"."+dateAsList[1]+"."+dateAsList[0]}<br />{time+":00 Uhr"}
    </Button>
    )
  });

  return (
    <div className={styles.SlotList}>
      {slots}
    </div>
  );
};

export default slotList;
