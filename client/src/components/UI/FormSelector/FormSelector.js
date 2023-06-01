import React from 'react';
import Input from '../Input/Input';

import styles from './FormSelector.module.css';

const formSelector = props => {
  let typeOptions;
  switch (props.ptRole) {
    case 'librarian':
      typeOptions = [
        {value: 'research', label: 'Rechercheberatung'}
      ];
      break;
    case 'methodTutor':
      typeOptions = [
        {value: 'methods', label: 'Methodenberatung'}
      ];
      break;
    default:
      typeOptions = [
        {value: 'student', label: 'Schreibberatung (Deutsch)'},
        {value: 'student_english', label: 'Schreibberatung (Englisch)'},
        {value: 'student_reading', label: 'Leseberatung (Deutsch)'},
        {value: 'phd', label: 'Promotionsberatung (Deutsch)'},
        {value: 'phd_english', label: 'Promotionsberatung (Englisch)'}
      ];
  }

  const formatOptions = [
    {value: 'digital', label: 'Online'},
    {value: 'analogue', label: 'In Präsenz'}
  ];

  return (
    <div className={styles.FormSelector}>
      <Input
        id='typeCheckboxes'
        inputtype='checkboxes'
        label='Wähle deine Beratungsform(en)'
        options={typeOptions}
        currentChecked={props.selectedTypes}
        onChange={props.onFormCheck} />
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
