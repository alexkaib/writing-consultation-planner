import React from 'react';

import styles from './TypeButton.module.css';

const typeButton = props => {
  return (
    <button className={styles.Button} onClick={() => props.buttonHandler(props.typeId)}>
      {props.children}
    </button>
  );
}

export default typeButton;
