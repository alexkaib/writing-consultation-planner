import React from 'react';
import styles from './StatSearch.module.css';
import langStrings from '../../../lang/languageStrings.json';

const dbExport = (props) => {

  const typeButtons = props.dbTables.map(tableName => (
    <button
      key={tableName}
      onClick={() => props.exportButtonHandler(tableName)}>
        {langStrings[props.language]['db_' + tableName]}
    </button>
  ));

  return (
    <div className={styles.ProtocolSearch}>
      <h2>{langStrings[props.language].db_export}</h2>
      <p>{langStrings[props.language].db_export_desc}</p>
      <div className={styles.SearchButtons}>
        {typeButtons}
      </div>
    </div>
  )
};

export default dbExport;
