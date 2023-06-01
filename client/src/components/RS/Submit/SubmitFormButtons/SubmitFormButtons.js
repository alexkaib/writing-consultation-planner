import React from 'react';

import styles from './SubmitFormButtons.module.css';

const submitFormButtons = props => {
  let buttons = (
    <button className={styles.available} onClick={props.goBackHandler}>
    {props.english?"Cancel reservation":"Zurück zur Terminauswahl"}
    </button>
  );
  if (window.matchMedia("(max-width: 800px)").matches) {
    buttons = null;
  };

  return (
  <div className={styles.SubmitButtons}>
    {buttons}
    <button
      className={props.available?styles.available:styles.unavailable}
      onClick={props.submitHandler}>
      {props.english?"Confirm appointment":"Abschicken"}
    </button>
  </div>
  )
};

export default submitFormButtons;
