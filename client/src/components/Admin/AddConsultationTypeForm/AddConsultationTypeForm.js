import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import Button from '../../UI/Button/Button';
import TypeInfo from '../TypeInfo/TypeInfo';

import styles from '../PTAdmin/PTManagement.module.css';

const addConsultationTypeForm = props => {
  return (
    <div className={styles.Box}>
      <h2>{langStrings[props.language]['add_consultation_type']}</h2>
      <p>{langStrings[props.language]['add_consultation_type_desc']}</p>
      <TypeInfo
        inputHandler={props.inputHandler}
        language={props.language}
        typeInfo={props.typeInfo} />
      <Button buttonHandler={props.submissionHandler}>
        {langStrings[props.language].submit}
      </Button>
    </div>
  )
}

export default addConsultationTypeForm;
