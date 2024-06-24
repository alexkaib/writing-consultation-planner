import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import Button from '../../UI/Button/Button';
import Input from '../../UI/Input/Input';

import styles from './FollowUpForm.module.css';

const newTutorForm = props => {
  return (
    <div className={styles.Box}>
      <h2>{langStrings[props.language]['add_follow_up']}</h2>
      <Input
        id='date'
        inputtype='date'
        type='date'
        label='An welchem Datum?'
        onChange={props.onChange} />

      <Input
        id='fromToTime'
        inputtype='fromToTime'
        label='Um wie viel Uhr?'
        onChange={props.onChange} />

      <Button buttonHandler={props.saveFollowUpHandler}>
        {langStrings[props.language].submit}
      </Button>
    </div>
  )
}

export default newTutorForm;
