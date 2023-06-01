import React from 'react';

import Input from '../../../UI/Input/Input';
import styles from './Form.module.css';

const methodsForm = props => {

  let errorMessage = "Bitte fülle diese Felder vollständig aus und überprüfe deine E-Mail.";

  let terminReasonsCheckboxes = [
    {value: 'Ich möchte eine passende Methode für meine Arbeit finden.', label: 'Ich möchte eine passende Methode für meine Arbeit finden.'},
    {value: 'Ich benötige Unterstützung bei der Anwendung von Forschungsmethoden.', label: 'Ich benötige Unterstützung bei der Anwendung von Forschungsmethoden.'},
    {value: 'Ich möchte über die Gliederung/das Forschungsdesign meiner Arbeit sprechen.', label: 'Ich möchte über die Gliederung/das Forschungsdesign meiner Arbeit sprechen.'},
    {value: 'Es gibt Fragen/Themen zu denen ich gerne gemeinsames Brainstorming (Erfahrungsaustausch, Ideenfindung) betreiben würde.', label: 'Es gibt Fragen/Themen zu denen ich gerne gemeinsames Brainstorming (Erfahrungsaustausch, Ideenfindung) betreiben würde.'},
    {value: 'Ich habe allgemeine Unsicherheiten im Umgang mit empirischen Forschungsmethoden.', label: 'Ich habe allgemeine Unsicherheiten im Umgang mit empirischen Forschungsmethoden.'},
    {value: 'Ich bin auf der Suche nach weiterführenden Informationen rund ums empirische Forschen (Literatur, Datenquellen, Lehrveranstaltungen).', label: 'Ich bin auf der Suche nach weiterführenden Informationen rund ums empirische Forschen (Literatur, Datenquellen, Lehrveranstaltungen).'},
    {value: 'Sonstige Gründe (siehe Freifeld).', label: 'Sonstige Gründe (bitte nutze das nächste Freifeld, um andere Gründe zu nennen).'}
  ];

  const semesterOptions = [
    {value: '1-2', label: '1-2'},
    {value: '3-4', label: '3-4'},
    {value: '5-6', label: '5-6'},
    {value: '7-8', label: '7-8'},
    {value: '9-10', label: '9-10'},
    {value: '11-12', label: '11-12'},
    {value: '> 12', label: '> 12'}
  ];

  let abschlussOptions = [
    {value: 'bachelor', label: 'Bachelor'},
    {value: 'master', label: 'Master'},
    {value: 'lehramt', label: 'Lehramt'},
    {value: 'magister', label: 'Magister'},
    {value: 'diplom', label: 'Diplom'},
    {value: 'promotion', label: 'Promotion'},
    {value: 'sonstiges', label: 'Sonstiges'}
  ];

  let fachbereichOptions = [
    {value: 1, label: 'FB 01 | Rechtswissenschaft'},
    {value: 2, label: 'FB 02 | Wirtschaftswissenschaften'},
    {value: 3, label: 'FB 03 | Gesellschaftswissenschaften'},
    {value: 4, label: 'FB 04 | Erziehungswissenschaften'},
    {value: 5, label: 'FB 05 | Psychologie und Sportwissenschaften'},
    {value: 6, label: 'FB 06 | Evangelische Theologie'},
    {value: 7, label: 'FB 07 | Katholische Theologie'},
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

  if (props.english) {

    errorMessage = "Please fill in these fields and make sure your e-mail is correct.";

    terminReasonsCheckboxes = [
      {value: 'Ich möchte eine passende Methode für meine Arbeit finden.', label: 'I want to find a fitting research method for my project.'},
      {value: 'Ich benötige Unterstützung bei der Anwendung von Forschungsmethoden.', label: 'I need support regarding the application of research methods.'},
      {value: 'Ich möchte über die Gliederung/das Forschungsdesign meiner Arbeit sprechen.', label: 'I would like to discuss the outline/research design of my project.'},
      {value: 'Es gibt Fragen/Themen zu denen ich gerne gemeinsames Brainstorming (Erfahrungsaustausch, Ideenfindung) betreiben würde.', label: 'I have some questions/topics which I would like to discuss.'},
      {value: 'Ich habe allgemeine Unsicherheiten im Umgang mit empirischen Forschungsmethoden.', label: 'I feel insecure about using empirical research methods.'},
      {value: 'Ich bin auf der Suche nach weiterführenden Informationen rund ums empirische Forschen (Literatur, Datenquellen, Lehrveranstaltungen).', label: 'I am looking for further information on research methods (literature, data sets, courses).'},
      {value: 'Sonstige Gründe (siehe Freifeld).', label: 'Other reasons (please elaborate below).'}
    ];

    abschlussOptions = [
      {value: 'bachelor', label: 'Bachelor'},
      {value: 'master', label: 'Master'},
      {value: 'lehramt', label: 'Teaching degree'},
      {value: 'magister', label: 'Magister'},
      {value: 'diplom', label: 'Diplom'},
      {value: 'promotion', label: 'PhD'},
      {value: 'sonstiges', label: 'Other'}
    ];

    fachbereichOptions = [
      {value: 1, label: 'FB 01 | Law'},
      {value: 2, label: 'FB 02 | Economics and Business Administration'},
      {value: 3, label: 'FB 03 | Social Sciences'},
      {value: 4, label: 'FB 04 | Educational Sciences'},
      {value: 5, label: 'FB 05 | Psychology and Sports Sciences'},
      {value: 6, label: 'FB 06 | Protestant Theology'},
      {value: 7, label: 'FB 07 | Roman Catholic Theology'},
      {value: 8, label: 'FB 08 | Philosophy and History'},
      {value: 9, label: 'FB 09 | Linguistics, Cultures and Arts'},
      {value: 10, label: 'FB 10 | Modern Languages'},
      {value: 11, label: 'FB 11 | Geosciences and Geography'},
      {value: 12, label: 'FB 12 | Computer Sciences and Mathematics'},
      {value: 13, label: 'FB 13 | Physics'},
      {value: 14, label: 'FB 14 | Biochemistry, Chemistry and Pharmacy'},
      {value: 15, label: 'FB 15 | Biological Sciences'},
      {value: 16, label: 'FB 16 | Medicine'}
    ];
  }

  return (
    <div>
      <h1>Methodenberatung</h1>
      <h1>{props.english?"You have selected an appointment on":"Du hast einen Termin am"} {props.date.split('-')[2]}.{props.date.split('-')[1]}.{props.date.split('-')[0]} {props.english?"at":"um"} {props.time}:00{props.english?".":" Uhr ausgewählt."}</h1>
      {props.english?
        <h3>We have reserved this appointment for 10 minutes. Please fill in the below form to confirm it. Your answers help our writing tutors prepare for your consultation and will be saved anonymously (i.e. seperately from your contact information) for statistical purposes.</h3> :
        <h3>Der Termin bleibt für die nächsten 10 Minuten reserviert. Füll bitte das folgende Formular zur Bestätigung aus. Deine Antworten helfen deiner*m Berater*in bei der Vorbereitung und werden anonym, d.h. separat von deinen Kontaktinformationen, für statistische Zwecke gespeichert.</h3>
      }
      <form className={styles.Form}>
        <h2>{props.english?"Contact Information":"Kontaktinformationen"}</h2>
        {props.invalidForm?<p style={{color: 'red'}}>{errorMessage}</p>:null}
        <div className={styles.NameForm}>
          <Input
            inputtype='input'
            label={props.english ? 'First name':'Vorname'}
            elementConfig={{
              id: 'firstName',
              type: 'text',
              value: props.rsInfo.firstName,
              placeholder: props.english ? 'First name':'Dein Vorname',
              onChange: props.inputHandler
            }} />
          <Input
            inputtype='input'
            label={props.english ? 'Last name':'Nachname'}
            elementConfig={{
              id: 'lastName',
              type: 'text',
              value: props.rsInfo.lastName,
              placeholder: props.english ? 'Last name':'Dein Nachname',
              onChange: props.inputHandler
            }} />
          <Input
            inputtype='input'
            label='E-Mail'
            elementConfig={{
              id: 'email',
              type: 'email',
              value: props.rsInfo.email,
              placeholder: 'E-Mail',
              onChange: props.inputHandler
            }}/>
          <Input
            inputtype='input'
            label={props.english?'E-Mail (please repeat)':'E-Mail (Wiederholung)'}
            elementConfig={{
              id: 'repeatEmail',
              type: 'email',
              value: props.rsInfo.repeatEmail,
              placeholder: 'E-Mail (Wdh.)',
              onChange: props.inputHandler
            }}/>
            {props.english ?
              <p>Please use your university e-mail (@stud.uni-frankfurt.de) if you have one, as there are known issues with other e-mail-providers (esp. outlook).</p> :
              <p>Nutze wenn möglich deine universitäre E-Mail-Adresse (@stud.uni-frankfurt.de), da es sonst zu Zustellungsproblemen (v.a. bei Outlook-Adressen) kommen kann.</p>
            }
        </div>

        <h2>{props.english?"Course of Study":"Studium"}</h2>
        <div className={styles.Study}>
          {props.english ?
            <p>Only specify the subject to which the consultation pertains.</p> :
            <p>Falls du mehrere Fächer studierst, gib bitte nur das Fach an, in dem du die zu beratende Arbeit schreibst.</p>
          }
          <Input
            inputtype='select'
            id='semester'
            label={props.english?'Current semester:':'Fachsemester:'}
            options={semesterOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='abschluss'
            label={props.english?'Course of study:':'Angestrebter Abschluss:'}
            options={abschlussOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='fachbereich'
            label='Fachbereich:'
            options={fachbereichOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='input'
            label={props.english?'Subject/discipline:':'Studienfach:'}
            elementConfig={{
              id: 'fach',
              type: 'text',
              value: props.rsInfo.fach,
              placeholder: props.english?'Discipline':'Fach',
              onChange: props.inputHandler
            }}/>
        </div>

        <h2>{props.english?"Methods Consultation":"Zur Methodenberatung"}</h2>

        <Input
          inputtype='checkboxes'
          id='terminReasons'
          label={props.english?'What are the reasons for your appointment?':'Was führt dich zur Methodenberatung?'}
          options={terminReasonsCheckboxes}
          currentChecked={props.rsInfo.terminReasons}
          onChange={props.inputHandler}/>

        <div className={styles.SmallText}>
          <Input
            inputtype='textarea'
            label={props.english?'Other reasons (max. 200 characters)':'Sonstige Gründe (max. 200 Zeichen)'}
            elementConfig={{
              id: 'otherReasons',
              type: 'text',
              maxLength: 200,
              value: props.rsInfo.otherReasons,
              onChange: props.inputHandler
            }} />
        </div>

        <div className={styles.SmallText}>
          <Input
            inputtype='textarea'
            label={props.english?'Research topic/question? (max. 500 characters)':'Thema/Fragestellung (max. 500 Zeichen)'}
            elementConfig={{
              id: 'topic',
              type: 'text',
              maxLength: 500,
              value: props.rsInfo.topic,
              placeholder: props.english?'What is the general topic of your research? What is your research question (if you have one)?':'Was ist das grobe Thema deiner Arbeit? Falls zutreffend, kannst du uns gern deine Forschungsfrage nennen.',
              onChange: props.inputHandler
            }} />
        </div>

        <div className={styles.SmallText}>
          <Input
            inputtype='textarea'
            label={props.english?'Comment (optional, max. 500 characters)':'Kommentar (optional, max. 500 Zeichen)'}
            elementConfig={{
              id: 'comment',
              type: 'text',
              maxLength: 500,
              value: props.rsInfo.comment,
              placeholder: props.english?'Is there anything else you would like to let us know?':'Gibt es sonst noch etwas, das wir wissen sollten?',
              onChange: props.inputHandler
            }} />
        </div>

        </form>
    </div>
  );
};

export default methodsForm;
