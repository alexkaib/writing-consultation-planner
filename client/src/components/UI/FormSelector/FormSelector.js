import React from 'react';
import Input from '../Input/Input';

import langStrings from '../../../lang/languageStrings.json';

import styles from './FormSelector.module.css';

const formSelector = props => {
  const checkedTypes = {};
  const typeOptions = [];

  props.consultationTypes.forEach(type => {
    const label = type.label[props.language] + ' [' + langStrings[props.language][type.audience] + ']'
    checkedTypes[type.id] = type.selected;
    typeOptions.push({value: type.id, label: label});
  });

  const formatOptions = [
    {value: 'digital', label: 'Online'},
    {value: 'analogue', label: 'In Präsenz'}
  ];

  return (
    <div className={styles.FormSelector}>
      <Input
        id='timeInput'
        inputtype='fromToTime'
        label='Um wie viel Uhr?'
        onChange={props.onTimeSet} />
      <Input
        id='typeCheckboxes'
        inputtype='checkboxes'
        label='Wähle deine Beratungsform(en)'
        language={props.language}
        options={typeOptions}
        currentChecked={props.selectedTypes}
        onChange={props.typeSelectHandler} />
      <Input
        id='formatCheckboxes'
        inputtype='checkboxes'
        label='Online und/oder in Präsenz?'
        options={formatOptions}
        currentChecked={props.selectedFormat}
        onChange={props.onFormCheck} />
    </div>
  )
}

export default formSelector;
