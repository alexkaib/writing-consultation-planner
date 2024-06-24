import React from 'react';
import Input from '../../UI/Input/Input';
import styles from './StatSearch.module.css';

import langStrings from '../../../lang/languageStrings.json';

const statSearch = (props) => {
  const currentYear = new Date().getFullYear();

  let monthOptions = [
    {value: 1, label: 'Januar'},
    {value: 2, label: 'Februar'},
    {value: 3, label: 'März'},
    {value: 4, label: 'April'},
    {value: 5, label: 'Mai'},
    {value: 6, label: 'Juni'},
    {value: 7, label: 'Juli'},
    {value: 8, label: 'August'},
    {value: 9, label: 'September'},
    {value: 10, label: 'Oktober'},
    {value: 11, label: 'November'},
    {value: 12, label: 'Dezember'}
  ];

  let yearOptions = [
    {value: 2021, label: '2021'},
    {value: 2022, label: '2022'},
    {value: 2023, label: '2023'},
    {value: 2024, label: '2024'},
    {value: 2025, label: '2025'},
    {value: 2026, label: '2026'},
    {value: 2027, label: '2027'},
    {value: 2028, label: '2028'},
    {value: 2029, label: '2029'},
    {value: 2030, label: '2030'}
  ]

  const typeButtons = props.availableTypes.map(type => (
    <button
      key={type.id}
      onClick={() => props.typeButtonHandler(type.id)}>
        {props.language === 'de' ? type.name_de : type.name_en}<br />
        <em>{langStrings[props.language][type.audience]}</em>
    </button>
  ));

  return (
    <div className={styles.ProtocolSearch}>
      <div className={styles.SearchRow}>
      <div className={styles.SearchInputs}>
          <h3>Von</h3>
          <Input
            inputtype='select'
            id='from_month'
            label={'Monat'}
            options={monthOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='from_year'
            defaultValue={currentYear}
            label={'Jahr'}
            options={yearOptions}
            onChange={props.inputHandler}/>
      </div>
      <div className={styles.SearchInputs}>
          <h3>Bis</h3>
          <Input
            inputtype='select'
            id='to_month'
            label={'Monat'}
            options={monthOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='to_year'
            defaultValue={currentYear}
            label={'Jahr'}
            options={yearOptions}
            onChange={props.inputHandler}/>
      </div>
      </div>
      <h3>{langStrings[props.language].consultation_type}</h3>
      <div className={styles.SearchButtons}>
        {typeButtons}
      </div>
    </div>
  )
};

export default statSearch;
