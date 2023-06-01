import React from 'react';

import styles from './Button.module.css';

const button = (props) => (
  <button className={styles.Button} onClick={props.buttonHandler}>
    <p>{props.children}</p>
  </button>
);

export default button;
