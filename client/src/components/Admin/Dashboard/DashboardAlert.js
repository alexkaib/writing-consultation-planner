import React from 'react';

import styles from './DashboardAlert.module.css';

const dashboardAlert = props => {
  return (
    <div className={styles.alert}>
      <span className={styles.closebtn} onClick={e => props.onCloseAlert(e)}>
        &times;
      </span>
      {props.children}
    </div>
  )
}

export default dashboardAlert;
