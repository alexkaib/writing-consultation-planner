import React from 'react';

import Input from '../../UI/Input/Input';
import styles from '../../RS/Submit/Form/Form.module.css';
import buttonStyles from '../../RS/Submit/SubmitFormButtons/SubmitFormButtons.module.css';

const loginForm = (props) => {
  return (
    <form onSubmit={e => props.submitLoginHandler(e)} className={styles.Form}>
      <h2>Bitte melde dich mit deinen Login-Daten an.</h2>
      <h3 style={{color: 'red'}}>{props.errorMessage}</h3>
      <div className={styles.NameForm}>
        <Input
          inputtype='input'
          label='E-Mail'
          elementConfig={{
            id: 'email',
            type: 'email',
            value: props.email,
            placeholder: 'E-Mail-Adresse',
            onChange: props.inputHandler
          }}/>
        <Input
          inputtype='input'
          label='Passwort'
          elementConfig={{
            id: 'password',
            type: 'password',
            value: props.password,
            placeholder: 'Passwort',
            onChange: props.inputHandler
          }} />
      </div>
      <div className={buttonStyles.SubmitButtons}>
        <button
          className={props.available?buttonStyles.available:buttonStyles.unavailable}
          type="submit">
          Anmelden
        </button>
      </div>
    </form>
  );
};

export default loginForm;
