import React from 'react';

import Slot from '../Slot/Slot';
import AddSlotButton from '../AddSlotButton/AddSlotButton';
import styles from './Day.module.css';

const day = props => {

  // TODO: filter out double slots by id (only show earliest)

  const slots = props.slots.map(slot => {
    return (
      <Slot
        key={slot.slotId}
        slotId={slot.slotId}
        ptId={slot.ptId}
        date={slot.date}
        time={slot.time}
        available={slot.available}
        rsId={slot.rsId}
        onSlotClick={props.onSlotClick}
        disableEmptySlots={props.disableEmptySlots}/>
    );
  });

  // adds a default button for adding slots only if that function is present
  // -> in PT context, all days are clickable
  if (props.addNewSlotHandler) {
    slots.push(
      <AddSlotButton
        date={props.date}
        addNewSlotHandler={props.addNewSlotHandler}
        available={true}/>
    );
  }

  let dayStyle = styles.Day;
  if (slots.length > 0) {
    if (props.showSlots) {
      dayStyle += ' ' + styles.Open;
    } else {
      dayStyle += ' ' + styles.Active;
    }
  }

  return (
    <>
    <button
      className={dayStyle}
      onClick={slots.length > 0 ?
        () => props.onDayClick(props.date) : null}>

      <div className={styles.DayButton}>
        {slots.length > 0 ?
          <div className={props.showSlots ?
            styles.arrowDown : styles.arrowRight}></div> : null}
        {props.weekday}, {props.date.split('-').reverse().join('.')}
      </div>
    </button>

    {props.showSlots ? <div className={styles.SlotContainer}>{slots}</div> : null}
    </>
  );
};

export default day;
