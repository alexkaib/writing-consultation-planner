import React from 'react';

import styles from './FormatToggle.module.css';

const formatToggle = props => (
  <div className={styles.ButtonContainer}>
    <button
      onClick={() => props.onFormatSelection('digital')}
      className={props.currentFormat==='digital'?styles.active:null}>
      Online
    </button>
    <button
      onClick={() => props.onFormatSelection('analogue')}
      className={props.currentFormat==='analogue'?styles.active:null}>
      {props.english?"In person":"In Präsenz"}
    </button>
    {/*
    <button
      className={props.currentFormat==='both'?styles.active:null}
      onClick={() => props.onFormatSelection('both')}>
      {props.english?"Either":"Egal"}
    </button>
    */}
  </div>
);

export default formatToggle;
