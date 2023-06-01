import React from 'react';

import styles from './InfoBox.module.css';

const infoBox = props => {
  return (
    <div className={styles.Container}>
      {props.content}
    </div>
  );
}

export default infoBox;
