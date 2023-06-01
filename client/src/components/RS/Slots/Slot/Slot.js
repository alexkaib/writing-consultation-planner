import React from 'react';
import { connect } from 'react-redux';

import styles from './Slot.module.css';

const slot = props => {
  const slotStyles = [styles.Slot];
  if (props.highlighted) {
    slotStyles.push(styles.Highlighted)
  };
  
  return (
    <div
      className={slotStyles.join(" ")}
      onClick={() => props.highlighted?props.onSlotClick(props.dateAndTime):null}>
      <p>{props.time}</p>
      {props.reservedDates.includes(props.dateAndTime)?<p>Reserviert</p>:null}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    reservedDates: state.pt.datesWithAppointments
  };
};

export default connect(mapStateToProps)(slot);
