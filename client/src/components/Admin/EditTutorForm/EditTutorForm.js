import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import Button from '../../UI/Button/Button';
import TutorInfo from '../TutorInfo/TutorInfo';

import styles from '../PTAdmin/PTManagement.module.css';

const editTutorForm = props => {
  return (
    <>
    <div className={styles.Box}>
      <h2>{langStrings[props.language]['edit_tutor']}</h2>
      <p>{langStrings[props.language]['edit_tutor_desc']}</p>
      <TutorInfo
        inputHandler={props.inputHandler}
        language={props.language}
        tutorInfo={props.tutorInfo} />
      <Button buttonHandler={props.submissionHandler}>
        {langStrings[props.language].submit}
      </Button>
    </div>

    <div className={styles.Box}>
      <h2>{langStrings[props.language]['delete_tutor']}</h2>
      <p>{langStrings[props.language]['delete_tutor_desc']}</p>
      <Button buttonHandler={props.deleteHandler}>
        {langStrings[props.language].delete_tutor_button}
      </Button>
    </div>
    {/*
    <div className={styles.Box}>
      <h2>{langStrings[props.language]['reset_pw']}</h2>
      <p>{langStrings[props.language]['reset_pw_desc']}</p>
      <Button buttonHandler={props.resetPwHandler}>
        {langStrings[props.language].reset_pw}
      </Button>
    </div>
    */}
    </>
  )
}

export default editTutorForm;
