import React from 'react';

import Input from '../../../UI/Input/Input';
import styles from './ProtocolSearch.module.css';
import buttonStyles from '../../../RS/Submit/SubmitFormButtons/SubmitFormButtons.module.css';

const protocolSearch = (props) => {
  return (
    <form onSubmit={e => props.submitSearchHandler(e)} className={styles.ProtocolSearch}>
      <h2>Protokollsuche</h2>
      <div className={styles.SearchInputs}>
        <Input
          inputtype='input'
          label={props.english ? 'Search term':'Suchbegriff'}
          elementConfig={{
            id: 'searchTerm',
            type: 'text',
            value: props.searchParams.searchTerm,
            placeholder: props.english ? 'Search for a specific term':'Durchsuche Protokolle nach Begriff',
            onChange: props.inputHandler
          }} />
      </div>
      <div className={buttonStyles.SubmitButtons}>
        <button
          className={buttonStyles.available}
          type="submit">
          {props.english?'Search':'Suchen'}
        </button>
      </div>
    </form>
  )
}

export default protocolSearch;
