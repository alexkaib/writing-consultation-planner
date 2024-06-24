import React from 'react';
import { connect } from 'react-redux';

import styles from './Slot.module.css';

const slot = props => {
  const slotStyles = [styles.Slot];
  if (!props.available) {
    slotStyles.push(styles.Highlighted)
  };

  let ariaString = props.available ? "Offener Termin: " : "Gebuchter Termin: ";

  ariaString += props.time + " Uhr " + props.date.split('-').reverse().join('.');

  return (
    <div
      className={slotStyles.join(" ")}
      onClick={() => props.onSlotClick(props)}>
      <button aria-label={ariaString}>
        {props.time}
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
