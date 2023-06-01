import React from 'react';

import styles from './Backdrop.module.css';

const backdrop = props => (
  props.visible ?
    <div className={styles.Backdrop} onClick={props.onBackdropClick}>
    </div> : null
);

export default backdrop;
