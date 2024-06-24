import React from 'react';

import styles from '../Dashboard/DashboardDisplay.module.css';

const ptStatDisplayer = props => {
  // test values
  const stats = [
    ['John Doe', 4, 5, 1],
    ['Mary Mayor', 0, 20, 0],
    ['Teddy Quentin', 9, 0, 4],
    ['Foo Bar', 2, 4, 2],
    ['Jenny Smith', 7, 4, 0],
  ];

  return (
    <div className={styles.Container}>

      <div className={styles.Box}>
        <h2>Statistiken</h2>

        <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Beratungen letzte 30 Tage</th>
            <th>Angebotene Termine</th>
            <th>Fehlende Protokolle</th>
          </tr>
        </thead>
        <tbody>
          {
            stats.map(row => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
              </tr>
            ))
          }
        </tbody>
        </table>
      </div>
    </div>
  )
}

export default ptStatDisplayer;
