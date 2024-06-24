import React from 'react';

import styles from './ResultDisplayer.module.css';
import Spinner from '../../../UI/Spinner/Spinner';

const resultDisplayer = (props) => {
  let toDisplay = <Spinner />;
  if (!props.searchLoading) {
    toDisplay = props.loadedProtocols.map(protocol => {
      const [year, month, day] = protocol.datum.split('-');
      return (
        <div key={protocol.protocolId} className={styles.Protocol}>
          <p>{day}.{month}.{year} ({protocol.fromTime} Uhr)</p>

          <div className={styles.Buttons}>
            <span
              onClick={() => props.onIconClick(protocol.rsId, 'rsInfo')}
              className="material-icons">
                info
            </span>
            <span
              onClick={() => props.onIconClick(protocol.protocolId, 'viewProtocol')}
              className="material-icons">
                grading
            </span>
            {/*
            <span
              onClick={() => props.onIconClick(protocol.protocolId, 'downloadProtocol')}
              className="material-icons">
                download
            </span>
            */}
          </div>
        </div>
      )
    });
  }
  return (
    <div className={styles.SearchResults}>
      {toDisplay}
    </div>
  )
}

export default resultDisplayer;
