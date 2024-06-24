import React from 'react';
import { connect } from 'react-redux';

import Button from '../../UI/Button/Button';

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
        <p>{langStrings[props.language]["pt_cal_explanation"]}</p>
        <Button buttonHandler={props.toggleExplanation}>{props.showExplanation?"Weniger":"Mehr"}</Button>
        {props.showExplanation ?
          <>
          <p><strong>Termine</strong>, die du anbietest, sind <strong>weiß</strong> hinterlegt. Mit einem Klick auf den Termin kannst du ihn wieder zurückziehen.</p>
          <p>Ein Feld mit <strong>orangenem Hintergrund</strong> steht für eine registrierte <strong>Anmeldung</strong>. Klicke diese Felder an, um Anmeldeinformationen einzusehen oder den Termin abzusagen.</p>
          <p>Klicke auf das Plus-Symbol, um neue Termine zu erstellen.</p>
          </>
          :
          null
        }
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
