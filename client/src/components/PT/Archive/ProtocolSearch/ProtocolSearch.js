import React from 'react';

import Input from '../../../UI/Input/Input';
import styles from './ProtocolSearch.module.css';
import buttonStyles from '../../../RS/Submit/SubmitFormButtons/SubmitFormButtons.module.css';

const protocolSearch = (props) => {
  let fachbereichOptions = [
    {value: 'na', label: 'Alle Fachbereiche'},
    {value: 1, label: 'FB 01 | Rechtswissenschaft'},
    {value: 2, label: 'FB 02 | Wirtschaftswissenschaften'},
    {value: 3, label: 'FB 03 | Gesellschaftswissenschaften'},
    {value: 4, label: 'FB 04 | Erziehungswissenschaften'},
    {value: 5, label: 'FB 05 | Psychologie und Sportwissenschaften'},
    {value: 6, label: 'FB 06 | Evangelische Theologie'},
    {value: 7, label: 'FB 07 | Katholische Theolgie'},
    {value: 8, label: 'FB 08 | Philosophie und Geschichtswissenschaften'},
    {value: 9, label: 'FB 09 | Sprach- und Kulturwissenschaften'},
    {value: 10, label: 'FB 10 | Neuere Philologien'},
    {value: 11, label: 'FB 11 | Geowissenschaften / Geographie'},
    {value: 12, label: 'FB 12 | Informatik und Mathematik'},
    {value: 13, label: 'FB 13 | Physik'},
    {value: 14, label: 'FB 14 | Biochemie, Chemie und Pharmazie'},
    {value: 15, label: 'FB 15 | Biowissenschaften'},
    {value: 16, label: 'FB 16 | Medizin'}
  ];

  let genreOptions = [
    {value: 'na', label: 'Alle Textsorten'},
    {value: 'Hausarbeit', label: 'Hausarbeit'},
    {value: 'Essay', label: 'Essay'},
    {value: 'Bachelorarbeit', label: 'Bachelorarbeit'},
    {value: 'Masterarbeit', label: 'Masterarbeit'},
    {value: 'WHA', label: 'WHA'},
    {value: 'Expose', label: 'Exposé'},
    {value: 'Thesenpapier', label: 'Thesenpapier'},
    {value: 'Portfolio', label: 'Portfolio'},
    {value: 'Bericht', label: 'Forschungs-/Praktikumsbericht'},
    {value: 'Dissertation', label: 'Dissertation'},
    {value: 'sonstiges', label: 'Sonstiges'}
  ];

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

          <Input
            inputtype='select'
            id='genre'
            label={props.english?'Genre of consulted text:':'Beratene Textsorte:'}
            options={genreOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='fachbereich'
            label={props.english?"Tutee's subject:":'Fachbereich der Ratsuchenden:'}
            options={fachbereichOptions}
            onChange={props.inputHandler}/>
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
