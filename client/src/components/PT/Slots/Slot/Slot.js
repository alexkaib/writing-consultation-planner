import React from 'react';

import styles from './Slot.module.css';

const slot = props => {
  const slotStyles = [styles.Slot];
  if (props.highlighted) {
    slotStyles.push(styles.Highlighted)
  };

  const dayDict = {
    1: "Montags",
    2: "Dienstags",
    3: "Mittwochs",
    4: "Donnerstags",
    5: "Freitags"
  };

  const [day, time] = props.daytime.split('-');

  return (
    <div
      className={slotStyles.join(" ")}
      onClick={() => props.onSlotClick(props.daytime)}>
      <button
        aria-label={dayDict[day] + " um " + time + " Uhr"}
        aria-pressed={props.highlighted}>
        {props.time}
      </button>
    </div>
  );
};

export default slot;
