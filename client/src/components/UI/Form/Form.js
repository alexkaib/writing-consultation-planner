import React from 'react';
import Input from '../Input/Input';

import styles from './Form.module.css';

// receives its structure from parent container, which gets it from config.json in turn
const form = props => {
  const formElements = props.formStructure.map(element => {
    switch (element.type) {
      case 'heading':
        return <h2 key={element.id}>{element.label[props.language]}</h2>

      case 'description':
        return <p key={element.id}>{element.label[props.language]}</p>

      case 'short_text':
        return (
          <Input
            inputtype={'input'}
            key={element.id}
            label={element.label[props.language]}
            elementConfig={{
              id: element.db_name,
              onChange: props.inputHandler,
              value: props.currentInfo[element.db_name]
            }} />
        );

      case 'medium_text':
        return (
          <div className={styles.TextBox}>
            <Input
              inputtype={'textarea'}
              key={element.id}
              label={element.label[props.language]}
              elementConfig={{
                id: element.db_name,
                onChange: props.inputHandler,
                value: props.currentInfo[element.db_name]
              }} />
          </div>
        );

      case 'long_text':
        return (
          <div className={styles.LongText}>
            <Input
              inputtype={'textarea'}
              key={element.id}
              label={element.label[props.language]}
              elementConfig={{
                id: element.db_name,
                onChange: props.inputHandler,
                value: props.currentInfo[element.db_name]
              }} />
          </div>
        );

      case 'email':
        return (
          <Input
            inputtype={'input'}
            key={element.id}
            label={element.label[props.language]}
            onChange={props.inputHandler}
            elementConfig={{
              id: element.db_name,
              onChange: props.inputHandler,
              type: 'email',
              value: props.currentInfo[element.db_name]
            }} />
        );

      case 'select':
        return (
          <Input
            inputtype={'select'}
            key={element.id}
            id={element.db_name}
            label={element.label[props.language]}
            options={element.options}
            selected={props.currentInfo[element.db_name]}
            language={props.language}
            onChange={props.inputHandler}
            elementConfig={{id: element.id}} />
        );

      case 'checkboxes':
        return (
          <Input
            inputtype={'checkboxes'}
            key={element.id}
            label={element.label[props.language]}
            id={element.db_name}
            options={element.options}
            language={props.language}
            onChange={props.inputHandler}
            currentChecked={props.currentInfo[element.db_name]}
            elementConfig={{id: element.id}} />
        );

      case 'files':
        return (
          <Input
            inputtype='file'
            key={element.id}
            label={element.label[props.language]}
            id={element.db_name}
            language={props.language}
            elementConfig={{
              id: element.id,
              type: 'file',
              onChange: props.inputHandler
            }} />
        );

      default:
        return null;
    }
  });
  return (
    <>
      <div className={styles.FormContainer}>
        {formElements}
      </div>
    </>
  );
}

export default form;
