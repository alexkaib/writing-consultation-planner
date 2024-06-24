import React from 'react';

import Button from '../../UI/Button/Button';
import TypeInfo from '../TypeInfo/TypeInfo';

import langStrings from '../../../lang/languageStrings.json';

import styles from '../PTAdmin/PTManagement.module.css';

const editConsultationTypeForm = props => {
  return (
    <>
    <div className={styles.Box}>
      <h2>{langStrings[props.language]['edit_type']}</h2>
      <p>{langStrings[props.language]['edit_type_desc']}</p>
      <TypeInfo
        typeInfo={props.typeInfo}
        language={props.language}
        inputHandler={props.inputHandler}>
      </TypeInfo>
      <Button buttonHandler={props.submissionHandler}>
        {langStrings[props.language].submit}
      </Button>
    </div>

    <div className={styles.Box}>
      <h2>{langStrings[props.language]['delete_type']}</h2>
      <p>{langStrings[props.language]['delete_type_desc']}</p>
      <Button buttonHandler={props.deleteHandler}>
        {langStrings[props.language].delete_type_button}
      </Button>
    </div>
    </>
  )
}

export default editConsultationTypeForm;
