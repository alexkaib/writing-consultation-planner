import React from 'react';

import styles from './ConsentForm.module.css';

import config from '../../config.json';
import langStrings from '../../lang/languageStrings.json';

const consentForm = (props) => {
  return (
    <div className={styles.ConsentForm}>
      <h2>{langStrings[props.language].privacy_terms}</h2>
      <p>{langStrings[props.language].privacy_terms_explanation} <a target='_blank' rel='noreferrer' href={config.privacy_terms}>{langStrings['de'].privacy_terms_link}</a></p>
      <input
        id='termsAccepted'
        type='checkbox'
        label={langStrings['de'].privacy_terms_agree}
        value={props.termsAccepted}
        onChange={props.onTermsCheck} />
      <label htmlFor='termsAccepted'>{langStrings[props.language].privacy_terms_agree}</label>
    </div>
  );
};

export default consentForm;
