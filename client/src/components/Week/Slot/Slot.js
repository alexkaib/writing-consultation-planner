import React from 'react';
import { connect } from 'react-redux';

import styles from './Slot.module.css';

const slot = props => {
  const slotStyles = [styles.Slot];
  if (props.highlighted) {
    slotStyles.push(styles.Highlighted)
  };

  const ariaString = props.time + " Uhr " + props.weekday.split('-').reverse().join('.');

  return (
    <div
      className={slotStyles.join(" ")}
      onClick={() => props.onSlotClick(props.dateAndTime)}>
      <button
        aria-label={ariaString}
        disabled={props.disableEmptySlots && !props.highlighted} >
        {props.unavailable?"!":props.time}
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    reservedDates: state.pt.datesWithAppointments
  };
};

export default connect(mapStateToProps)(slot);
