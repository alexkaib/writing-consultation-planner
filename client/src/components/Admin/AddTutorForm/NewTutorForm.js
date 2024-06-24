import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import Button from '../../UI/Button/Button';
import TutorInfo from '../TutorInfo/TutorInfo';

import styles from '../PTAdmin/PTManagement.module.css';

const newTutorForm = props => {
  return (
    <div className={styles.Box}>
      <h2>{langStrings[props.language]['add_tutor']}</h2>
      <p>{langStrings[props.language]['add_tutor_desc']}</p>
      <TutorInfo
        inputHandler={props.inputHandler}
        language={props.language}
        tutorInfo={props.tutorInfo} />
      <Button buttonHandler={props.submissionHandler}>
        {langStrings[props.language].submit}
      </Button>
    </div>
  )
}

export default newTutorForm;
