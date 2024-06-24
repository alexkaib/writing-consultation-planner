import React from 'react';

import NavItems from '../NavItems/NavItems';
import Logo from '../../Logo/Logo';
import LangLogo from '../../Logo/LangLogo';
import styles from './Toolbar.module.css';

const toolbar = props => {
  return (
    <div className={styles.Toolbar}>
      <Logo />
      {props.menuExtended ? <NavItems /> : null}
      <LangLogo />
    </div>
  )
};

export default toolbar;
