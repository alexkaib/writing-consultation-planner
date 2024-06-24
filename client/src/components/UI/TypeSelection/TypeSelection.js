import React from 'react';

import TypeButton from './TypeButton/TypeButton';
import styles from './ConsultationTypes.module.css';
import langStrings from '../../../lang/languageStrings.json';

const typeSelection = (props) => {
  const audience_groups = [];

  for (var i in props.audiences) {
    const audience = props.audiences[i];
    const audience_group = (
      <div key={audience} style={{width: '100%'}}>
        <h2 >{langStrings[props.language][audience]}</h2>
        <div className={styles.TypeContainer}>
        {
          props.consultationTypes.map(type => {
            if (type.audience === audience) {
              return (
                <TypeButton
                  className={styles.TypeContainer}
                  buttonHandler={props.buttonHandler}
                  typeId={type.id}
                  key={type.id}>
                    {type.label[props.language]}
                </TypeButton>
              )
            } else {
              return null;
            }
          })
        }
        </div>
      </div>
    );

    audience_groups.push(audience_group);
  }

  return (
    <div className={styles.ConsultationTypes}>
      <h1 style={{width:"100%"}}>{langStrings[props.language]["nav_consultation_config"]}</h1>
      {audience_groups}
    </div>
  );
}

export default typeSelection;
