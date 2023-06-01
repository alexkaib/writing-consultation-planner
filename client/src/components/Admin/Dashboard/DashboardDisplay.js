import React from 'react';

import styles from './DashboardDisplay.module.css';

const dashboardDisplay = props => {
  // test values
  const stats = {
      openSlotsFuture: 3,
      openSlotsRecent: 30,
      openSlotsPast: 95,
      firstBookingsFuture: 4,
      firstBookingsRecent: 7,
      firstBookingsPast: 28,
      followUpsFuture: 5,
      followUpsRecent: 10,
      followUpsPast: 34,
      guestRequestsFuture: 2,
      guestRequestsRecent: 1,
      guestRequestsPast: 18,
      protocols: 23,
      missingProtocols: 37,
      noShows: 10,
      evaluationsSent: 60
  }

  return (
    <div className={styles.Container}>

      <div className={styles.Box}>
        <h2>Aktuelle Zahlen</h2>

        <table>
        <thead>
          <tr>
            <th></th>
            <th>Offene Termine</th>
            <th>Erstberatungen</th>
            <th>Folgeberatungen</th>
            <th>Hospitationsanfragen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Nächste 30 Tage</th>
            <td>{stats.openSlotsFuture}</td>
            <td>{stats.firstBookingsFuture}</td>
            <td>{stats.followUpsFuture}</td>
            <td>{stats.guestRequestsFuture}</td>
          </tr>
          <tr>
            <th>Letzte 30 Tage</th>
            <td>{stats.openSlotsRecent}</td>
            <td>{stats.firstBookingsRecent}</td>
            <td>{stats.followUpsRecent}</td>
            <td>{stats.guestRequestsRecent}</td>
          </tr>
          <tr>
            <th>Letzte 180 Tage</th>
            <td>{stats.openSlotsPast}</td>
            <td>{stats.firstBookingsPast}</td>
            <td>{stats.followUpsPast}</td>
            <td>{stats.guestRequestsPast}</td>
          </tr>
        </tbody>
        </table>
      </div>

      <div className={styles.Box}>
        <h2>Dokumentation (letzte sechs Monate)</h2>
        <button onClick={props.togglePercentages}>Absolut / Prozentual</button>
        <ul>
          <li>
            Fehlende Protokolle: {props.showPercentages ? '10%' : stats.missingProtocols}
          </li>
          <li>
            Nicht erschienene Ratsuchende: {props.showPercentages ? '12%' : stats.noShows}
          </li>
          <li>
            Verschickte Evaluations-Emails: {props.showPercentages ? '68%' : stats.evaluationsSent}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default dashboardDisplay;
