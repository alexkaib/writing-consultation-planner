import React from 'react';
import { connect } from 'react-redux';

import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

import langStrings from '../../../lang/languageStrings.json';
import styles from './Options.module.css';

const options = (props) => {

  let dayOptions = [];
  for (let i = 2; i < 29; i++) {
    dayOptions.push(
      {value: i, label: i.toString() + " Tage"}
    );
  }

  return (
    <div>
      <div className={styles.Explanation}>
        <h3>{langStrings[props.language]["pt_cal_explanation_header"]}</h3>
        <p>Klicke auf ein beliebiges Feld im Kalender, um Terminverwaltungsoptionen anzuzeigen.</p>
        <Button buttonHandler={props.toggleExplanation}>{props.showExplanation?"Weniger":"Mehr"}</Button>
        {props.showExplanation ?
          <AuxComp>
          <p><strong>Termine</strong>, die du anbietest, sind <strong>weiß</strong> hinterlegt. Mit einem Klick auf den Termin kannst du ihn wieder zurückziehen.</p>
          <p>Ein Feld mit <strong>Ausrufezeichen</strong> steht für eine registrierte <strong>Anmeldung</strong>. Klicke diese Felder an, um Anmeldeinformationen einzusehen oder den Termin abzusagen.</p>
          <p>Alle anderen Felder können angeklickt werden, um einen Termin am jeweiligen Datum zu erstellen.</p>
          </AuxComp>
          :
          null
        }
        <Button buttonHandler={props.toggleViewHandler}>{props.calendarView?"Listenansicht":"Kalenderansicht"}</Button>
      </div>

      <div className={styles.Options}>
        <h3>Krankmeldung</h3>
        <p>Um mehrere Termine auf einmal zu löschen, kannst du dieses Formular benutzen.</p>
        <Input
          inputtype='select'
          label='Zeitraum:'
          options={dayOptions}
          onChange={props.daySelectHandler} />
        <Input
          inputtype='checkboxes'
          options={[{label: 'Beratungen absagen und Mails verschicken', value: 'cancelAppointments'}]}
          currentChecked={{cancelAppointments: props.cancelAppointments}}
          onChange={props.toggleCancelAppointments} />
        {props.cancelAppointments ?
          <p>Alle Ratsuchenden, die Termine vereinbart hatten, werden automatisch per E-Mail informiert. Ratsuchende mit Erstberatungen werden gebeten, einen neuen Termin zu finden. Ratsuchende mit Folgeberatungen solltest du, wenn möglich, selbst kontaktieren, um einen neuen Termin auszumachen.</p>
          :
          null
        }
        <Button buttonHandler={props.submitCancelRequest}>Termine löschen</Button>
        </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    language: state.rs.language
  };
};

export default connect(mapStateToProps)(options);
