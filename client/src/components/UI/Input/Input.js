import React from 'react';

import langStrings from '../../../lang/languageStrings.json';
import styles from './Input.module.css';

const input = props => {

  let inputElement = null;
  let label = props.label;

  if (props.elementConfig && props.elementConfig.maxLength) {
    label += (
      ' (' + langStrings[props.language].max_chars.replace("{{number}}", props.elementConfig.maxLength) + ')'
    )
  }

  switch (props.inputtype) {
    case 'input':
      inputElement = <input
                        className={props.highlighted?styles.InputHighlighted:styles.InputElement}
                        {...props.elementConfig} />;
      break;

    case 'inputWithText':
      inputElement = (<div className={styles.InputWithText}>
                        <input
                          className={props.highlighted?styles.InputHighlighted:styles.InputElement}
                          {...props.elementConfig} />
                        <p>{props.additionalText}</p>
                      </div>);
      break;

    case 'textarea':
      inputElement = <textarea
                        className={props.highlighted?styles.InputHighlighted:styles.InputElement}
                        {...props.elementConfig} />;
      break;

    case 'select':
      if (typeof props.options[0].label === 'object') {
        inputElement = (
          <select
            className={styles.InputElement}
            onChange={props.onChange}
            id={props.id}
            value={props.selected}
            defaultValue={props.defaultValue}>
            {props.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label[props.language]}
              </option>
            ))}
          </select>
        );
      } else {
        inputElement = (
          <select
            className={styles.InputElement}
            onChange={props.onChange}
            id={props.id}
            value={props.selected}
            defaultValue={props.defaultValue}>
            {props.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      }
      break;

    case 'checkboxes':
      if (typeof props.options[0].label === 'object') {
        inputElement = (
          <div className={styles.CheckBoxes} id={props.id}>
            {props.options.map(option => (
            <div key={option.value}>
              <input id={option.value} type='checkbox' checked={props.currentChecked[option.value]} label={option.label[props.language]} value={option.value} onChange={props.onChange} />
              <label className={styles.CheckboxLabel} htmlFor={option.value}>{option.label[props.language]}</label>
            </div>
            ))}
          </div>
        );
      } else {
        inputElement = (
          <div className={styles.CheckBoxes} id={props.id}>
            {props.options.map(option => (
            <div key={option.label}>
              <input id={option.value} type='checkbox' checked={props.currentChecked[option.value]} label={option.label} value={option.value} onChange={props.onChange} />
              <label className={styles.CheckboxLabel} htmlFor={option.value}>{option.label}</label>
            </div>
            ))}
          </div>
        );
      }
      break;

    case 'time':
      inputElement = <input type="time" {...props.elementConfig} />;
      break;

    case 'fromToTime':
      inputElement = (
        <div className={styles.FromToTime} id={props.id}>
          Von <input type='time' id='from' onChange={props.onChange}/> bis <input type='time' id='to' onChange={props.onChange}/>
        </div>
      );
      break;

    case 'file':
      inputElement = <input multiple style={{width:'auto'}} className={styles.InputElement} {...props.elementConfig} />;
      break;

    default:
      inputElement = <input className={styles.InputElement} {...props} />;
    };

  return (
    <div className={styles.Input}>
      <label className={styles.Label}>{label}</label>
      {inputElement}
    </div>
  );
};

export default input;
