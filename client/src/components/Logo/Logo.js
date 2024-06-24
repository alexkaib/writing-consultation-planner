import React from 'react';

import guLogo from '../../assets/university-logo.png';
import szLogo from '../../assets/writing-center-logo.png';
import styles from './Logo.module.css';

const logo = (props) => (
  <div className={styles.Logo}>
    <img src={guLogo} alt="University logo" />
    <img src={szLogo} alt="Institution logo" style={{height: '80%'}} />
  </div>
);

export default logo;
