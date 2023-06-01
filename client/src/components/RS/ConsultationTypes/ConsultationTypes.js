import React from 'react';

import TypeButton from './TypeButton/TypeButton';
import styles from './ConsultationTypes.module.css';

const consultationTypes = (props) => {
  const textContent = {
    h1: "Unsere Beratungsangebote",
    students: "Für Studierende",
    phds: "Für Promovierende",
    explanation: 'Wähle zunächst deine Beratungsform. Im nächsten Schritt kannst du optional einen Fachschwerpunkt setzen und zwischen Online- und Präsenzberatungen wählen.',
    feedbackExplanation: '*Textfeedback kann natürlich auch Teil einer regulären Schreibberatung sein - in der Regel bevorzugen wir ein Gespräch über deinen Text - aber falls Videokonferenzen für dich nicht in Frage kommen, bieten wir zurzeit auch rein schriftliches Feedback per E-Mail an.'
  }
  if (props.english) {
    textContent.h1 = "Select Consultation Type";
    textContent.students = "For students:";
    textContent.phds = "For PhD students:";
    textContent.explanation = 'Afterwards, you can choose between online and in person consultation and optionally select the discipline of your tutor.';
    textContent.feedbackExplanation = null;
  }

  const studentTypes = props.studentConsultationTypes.map(typeAndText => {
    return (
      <TypeButton
        key={typeAndText.type}
        logo={typeAndText.logo}
        buttonHandler={() => props.onTypeSelect(typeAndText.type)}>
        {typeAndText.text}
      </TypeButton>
    );
  });

  const phdTypes = props.phdConsultationTypes.map(typeAndText => {
    return (
      <TypeButton
        key={typeAndText.type}
        logo={typeAndText.logo}
        buttonHandler={() => props.onTypeSelect(typeAndText.type)}>
        {typeAndText.text}
      </TypeButton>
    );
  });

  return (
    <div>
      <div className={styles.ConsultationTypes}>
      <h1 style={{width:"100%"}}>{textContent.h1}</h1>
      <p>{textContent.explanation}</p>
      <h2 style={{width:"100%"}}>{textContent.students}</h2>
      <div className={styles.TypeContainer}>
        {studentTypes}
      </div>
      {
        //<p style={{width:"100%"}}>{textContent.feedbackExplanation}</p>
      }
      <h2 style={{width:"100%"}}>{textContent.phds}</h2>
      <div className={styles.TypeContainer}>
          {phdTypes}
      </div>
      <div className={styles.TypeContainer}>
      </div>
      </div>
    </div>
  );
}

export default consultationTypes;
