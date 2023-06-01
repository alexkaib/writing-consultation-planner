import React from 'react';

import styles from './Registration.module.css';

const registration = (props) => {

  let protocolButtonStyle = {color: 'black'};
  let protocolButtonBehavior = () => props.onIconClick(props.terminId, 'createProtocol');
  let archiveButtonStyle = {color: '#ccc'};
  let archiveButtonBehavior = null;

  let reviewButtonStyle = {color: 'black'};
  //function needs both terminId to set EvaluationVerschickt=true and rsEmail to send the link with the id
  let reviewButtonBehavior = () => props.onIconClick([props.terminId, props.rsEmail, props.rsFirstName], 'sendEvalLink');

  let followUpButtonStyle = {color: 'black'};
  let followUpButtonBehavior = () => props.onIconClick([props.terminId, props.rsId], 'createFollowUp');

  let reserveRoomButtonStyle = {color: 'black'};
  let reserveRoomButtonBehavior = () => props.onIconClick(props.terminId, 'reserveRoom');

  if (parseInt(props.evaluationSent) === 1) {
    reviewButtonStyle = {color: 'green'};
    reviewButtonBehavior = null;
  }

  if (props.protocolId || props.ptRole === 'librarian' || props.ptRole === 'methodTutor') {
    protocolButtonStyle = {color: 'green'};
    protocolButtonBehavior = () => props.onIconClick(props.protocolId, 'viewProtocol');
    archiveButtonStyle = {color: 'black'};
    archiveButtonBehavior = () => props.onIconClick([props.terminId, props.followUpId, props.rsId], 'archive');
  }

  if (props.followUpId) {
    followUpButtonStyle = {color: 'green'};
    followUpButtonBehavior = () => props.onIconClick(props.followUpId, 'viewFollowUp');
  }

  if (props.roomReserved === '1') {
    reserveRoomButtonStyle = {color: 'green'};
  }

  let style = styles.Registration;
  if (props.highlighted) {
    style = styles.Registration + " " + styles.Highlighted;
  }

  const [year, month, day] = props.date.split("-");

  const availableButtons = [
    <button
      key='info'
      aria-label="Informationen zu Ratsuchenden"
      onClick={() => props.onIconClick(props.rsId, 'info')}
      title="Klick diesen Button, um die Anmeldeinformationen der Person einzusehen, die diesen Termin gebucht hat."
      className="material-icons"    >
        info
    </button>,
    <button
      key='followUp'
      aria-label="Folgeberatung vereinbaren"
      onClick={followUpButtonBehavior}
      style={followUpButtonStyle}
      title="Klick diesen Button, um eine Folgeberatung einzutragen. Bei grünem Icon wurde bereits eine Folgeberatung erstellt und ein Klick hebt diese im Menü hervor."
      className="material-icons">
        next_plan
    </button>,
    <button
      key='forward'
      aria-label="Beratung weiterleiten"
      onClick={() => props.onIconClick(props.terminId, 'sendConference')}
      title="Klick diesen Button, um diese Beratung bzw. Ratsuchende an eine*n andere*n Berater*in zu senden. Sie taucht dann nicht mehr hier auf."
      className="material-icons">
        person_add
    </button>,
    <button
      key='archive'
      aria-label="Beratung archivieren"
      onClick={archiveButtonBehavior}
      style={archiveButtonStyle}
      title="Klick diesen Button, um die Beratung zu archivieren. Archivierte Beratungen werden hier nicht mehr angezeigt, können aber weiterhin im Archiv eingesehen werden."
      className="material-icons">
        delete
    </button>
  ];

  if (props.ptRole === 'methodTutor') {
    availableButtons.splice(1, 0,
      <button
        key='evaluation'
        aria-label="Evaluation verschicken"
        onClick={reviewButtonBehavior}
        style={reviewButtonStyle}
        title="Klick diesen Button, um eine Evaluation zu versenden."
        className="material-icons">
          rate_review
      </button>
    );
  }

  if (props.ptRole === 'peertutor' || props.ptRole === 'admin') {

    availableButtons.splice(1, 0,
      <button
        key='evaluation'
        aria-label="Evaluation verschicken"
        onClick={reviewButtonBehavior}
        style={reviewButtonStyle}
        title="Klick diesen Button, um eine Evaluation zu versenden."
        className="material-icons">
          rate_review
      </button>
    );

    availableButtons.splice(1, 0,
      <button
        key='protocol'
        aria-label="Protokoll bearbeiten"
        onClick={protocolButtonBehavior}
        style={protocolButtonStyle}
        title="Klick diesen Button, um ein Protokoll zu dieser Beratung zu schreiben oder zu bearbeiten. Ein grünes Icon bedeutet, dass bereits ein Protokoll vorliegt."
        className="material-icons">
          grading
      </button>
    );

    availableButtons.splice(1, 0,
      <button
        key='reservation'
        aria-label="Beratungsraum reservieren"
        onClick={reserveRoomButtonBehavior}
        style={reserveRoomButtonStyle}
        title="Klick diesen Button, um den Beratungsraum zu reservieren. Ein grünes Icon bedeutet, dass du ihn für diese Beratung bereits reserviert hast."
        className="material-icons">
          home
      </button>
    );
  }

  return (
    <div className={style}>
      <p>{day}.{month}.{year}, {props.time}:00 Uhr</p>
      <p>{props.rsFirstName} {props.rsLastName}</p>

      <div className={styles.Buttons}>
        {availableButtons}
      </div>
    </div>
  )
}

export default registration;
