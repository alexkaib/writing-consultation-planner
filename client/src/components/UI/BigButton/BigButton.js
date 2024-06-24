import React from 'react';

import styles from './BigButton.module.css';

const bigButton = (props) => (
  <div className={styles.ButtonContainer}>
    <button
      className={styles.BigButton + ' ' + (props.available?styles.available:styles.unavailable)}
      onClick={props.available?props.buttonHandler:null}>
      <p>{props.children}</p>
    </button>
  </div>
);

export default bigButton;
