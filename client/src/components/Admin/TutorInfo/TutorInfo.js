import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import styles from './TutorInfo.module.css';

import Input from '../../UI/Input/Input';

const tutorInfo = props => {
  return (
    <>
    <div className={styles.TutorInfoBox}>
      <Input
        language={props.language}
        inputtype='input'
        label={langStrings[props.language].first_name}
        elementConfig={{
          id: 'firstName',
          type: 'text',
          value: props.tutorInfo.firstName,
          maxLength: 30,
          placeholder: langStrings[props.language].first_name,
          onChange: props.inputHandler
        }}/>

      <Input
        language={props.language}
        inputtype='input'
        label={langStrings[props.language].last_name}
        elementConfig={{
          id: 'lastName',
          type: 'text',
          maxLength: 30,
          value: props.tutorInfo.lastName,
          placeholder: langStrings[props.language].last_name,
          onChange: props.inputHandler
        }}/>

      <Input
        language={props.language}
        inputtype='input'
        label={langStrings[props.language].email}
        elementConfig={{
          id: 'email',
          type: 'email',
          value: props.tutorInfo.email,
          maxLength: 50,
          placeholder: langStrings[props.language].email,
          onChange: props.inputHandler
        }}/>

      <Input
        language={props.language}
        inputtype='input'
        label={langStrings[props.language].password}
        elementConfig={{
          id: 'password',
          type: 'text',
          value: props.tutorInfo.password,
          maxLength: 30,
          placeholder: langStrings[props.language].password_info,
          onChange: props.inputHandler
        }}/>

      <Input
        language={props.language}
        inputtype='input'
        label={langStrings[props.language].subject}
        elementConfig={{
          id: 'subjects',
          type: 'text',
          value: props.tutorInfo.subjects,
          maxLength: 30,
          placeholder: langStrings[props.language].subject,
          onChange: props.inputHandler
        }}/>

      <Input
        language={props.language}
        inputtype='select'
        label={langStrings[props.language].role}
        id='role'
        defaultValue={props.tutorInfo.role}
        onChange={props.inputHandler}
        options={[
          {value: 'peerTutor', label: langStrings[props.language].peerTutor},
          {value: 'admin', label: langStrings[props.language].admin}
        ]}/>

    </div>
    <div className={styles.MailInfoBox}>
      <Input
        language={props.language}
        inputtype='textarea'
        label={langStrings[props.language].tutor_mail_text}
        elementConfig={{
          id: 'mailText',
          type: 'text',
          value: props.tutorInfo.mailText,
          maxLength: 1200,
          placeholder: langStrings[props.language].tutor_mail_text_desc,
          onChange: props.inputHandler
        }}/>
      </div>
    </>
  )
}

export default tutorInfo;
