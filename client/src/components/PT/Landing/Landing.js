import React from 'react';

import AuxComp from '../../../hoc/AuxComp/AuxComp';
import styles from './Landing.module.css';

const landing = (props) => {
  const navButtons = props.locations.map(loc => (
    <AuxComp key={loc.location}>
      <button onClick={() => props.navButtonHandler(loc.location)} className={styles.LocButton}>
      <h2>{loc.buttonLable}</h2>
      <p className={styles.LandingText}>{loc.buttonDescription}</p>
      </button>
    </AuxComp>
  ));

  return (
    <AuxComp>
    <h1 style={{textAlign:'center'}}>{props.greeting}</h1>
    <div className={styles.Landing}>
      {navButtons}
    </div>
    </AuxComp>
  );
}

export default landing;
