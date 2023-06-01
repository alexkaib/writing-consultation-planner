import React from 'react';

import styles from './TypeButton.module.css';
import szLogo from '../../../../assets/writing-center-logo.png';

const typeButton = props => {
  let logo;
  let logoAltText;
  switch (props.logo) {
    case 'sz':
      logo = szLogo;
      logoAltText = 'Writing Center logo';
      break;
    default:
      logo = szLogo;
      logoAltText = 'Writing Center logo';
      break;
  }
  return (
    <button className={styles.Button} onClick={props.buttonHandler}>
      <p>{props.children}</p>
      <img src={logo} alt={logoAltText}/>
    </button>
  );
}

export default typeButton;
