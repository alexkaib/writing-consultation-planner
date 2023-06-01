import React from 'react';

import Button from '../../UI/Button/Button';
import styles from './Logout.module.css';

const logout = (props) => (
  <div className={styles.Logout}>
    <h3 className={styles.LogoutText}>Momentan angemeldet als: {props.name}</h3>
    <Button buttonHandler={props.onLogoutButton}>Abmelden</Button>
  </div>
);

export default logout;
