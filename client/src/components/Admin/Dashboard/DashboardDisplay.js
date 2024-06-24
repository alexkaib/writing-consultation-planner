import React from 'react';

import styles from './DashboardDisplay.module.css';

import langStrings from '../../../lang/languageStrings.json';

const dashboardDisplay = props => {
  const missingProtocolsPercentage =
    Math.round(props.stats.missingProtocols / props.stats.totalBookingsPast * 100);

  const noShowsPercentage =
    Math.round(props.stats.noShows / props.stats.totalBookingsPast * 100);

  const evalPercentage =
    Math.round(props.stats.evaluationsSent / props.stats.totalBookingsPast * 100);

  return (
    <div className={styles.Container}>

      <div className={styles.Box}>
        <h2>Aktuelle Zahlen</h2>

        {
          props.consultationTypes.map(type => (
            <button
              className={styles.DashboardButton}
              key={type.id}
              id={type.id}
              onClick={props.onTypeSelect}>
              {props.language === 'de' ? type.name_de : type.name_en}<br />
              <em>{langStrings[props.language][type.audience]}</em>
            </button>
          ))
        }

        <table>
        <thead>
          <tr>
            <th></th>
            <th>Offene Termine</th>
            <th>Gebuchte Beratungen</th>
            <th>Erstberatungen</th>
            <th>Folgeberatungen</th>
            <th>Hospitationsanfragen</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Nächste 30 Tage</th>
            <td>{props.stats.openSlotsFuture}</td>
            <td>{props.stats.totalBookingsFuture}</td>
            <td>{props.stats.firstBookingsFuture}</td>
            <td>{props.stats.followUpsFuture}</td>
            <td>{props.stats.guestRequestsFuture}</td>
          </tr>
          <tr>
            <th>Letzte 30 Tage</th>
            <td>{props.stats.openSlotsRecent}</td>
            <td>{props.stats.totalBookingsRecent}</td>
            <td>{props.stats.firstBookingsRecent}</td>
            <td>{props.stats.followUpsRecent}</td>
            <td>{props.stats.guestRequestsRecent}</td>
          </tr>
          <tr>
            <th>Letzte 180 Tage</th>
            <td>{props.stats.openSlotsPast}</td>
            <td>{props.stats.totalBookingsPast}</td>
            <td>{props.stats.firstBookingsPast}</td>
            <td>{props.stats.followUpsPast}</td>
            <td>{props.stats.guestRequestsPast}</td>
          </tr>
        </tbody>
        </table>
      </div>

      <div className={styles.Box}>
        <h2>Dokumentation (letzte sechs Monate)</h2>
        <button onClick={props.togglePercentages}>Absolut / Prozentual</button>
        <ul>
          <li>
            Fehlende Protokolle: {props.showPercentages ? (
              props.stats.totalBookingsPast === 0 ?  'NA' : missingProtocolsPercentage + "%"
            ) : props.stats.missingProtocols}
          </li>
          <li>
            Nicht erschienene Ratsuchende: {props.showPercentages ? (
              props.stats.totalBookingsPast === 0 ?  'NA' : noShowsPercentage + "%"
            ) : props.stats.noShows}
          </li>
          <li>
            Verschickte Evaluations-Emails: {props.showPercentages ? (
              props.stats.totalBookingsPast === 0 ?  'NA' : evalPercentage + "%"
            ) : props.stats.evaluationsSent}
          </li>
        </ul>
      </div>
    </div>
  )
}

export default dashboardDisplay;
