import React from 'react';
import Input from '../../UI/Input/Input';
import styles from './StatSearch.module.css';

const statSearch = (props) => {
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
    {value: 2025, label: '2025'}
  ]

  const typeButtons = Object.keys(props.selectedTypes).map(type => (
    <button
      key={type}
      onClick={() => props.typeButtonHandler(type)}
      className={props.selectedTypes[type]?styles.active:styles.inactive}>
        {type}
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
            label={'Jahr'}
            options={yearOptions}
            onChange={props.inputHandler}/>
      </div>
      </div>
      <div className={styles.SearchButtons}>
        {typeButtons}
      </div>
    </div>
  )
};

export default statSearch;
