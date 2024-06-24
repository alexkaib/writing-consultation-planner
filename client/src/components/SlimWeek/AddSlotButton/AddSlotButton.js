import React from 'react';
import { connect } from 'react-redux';

import styles from '../Slot/Slot.module.css';

const addSlotButton = props => {
  return (
    <div
      className={styles.Slot}
      onClick={() => props.addNewSlotHandler(props.date)}>
      <button aria-label={"Add a new slot"}>
        +
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    language: state.rs.language
  };
};

export default connect(mapStateToProps)(addSlotButton);
