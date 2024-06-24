import React from 'react';

import styles from './InfoBox.module.css';

const infoBox = props => {
  return (
    <div className={styles.Container}>
      <h2>{props.header}</h2>
      <p>{props.info}</p>
    </div>
  );
}

export default infoBox;
