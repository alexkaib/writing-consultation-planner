import React from 'react';

import Input from '../../../UI/Input/Input';
import styles from './Form.module.css';

const iszForm = props => {

  let errorMessage = "Bitte füllen Sie diese Felder vollständig aus und überprüfen Sie Ihre E-Mail.";

  let howDidYouFindUsCheckboxes = [
    {value: 'flyer', label: 'Flyer/Poster'},
    {value: 'dozierende', label: 'Dozierende'},
    {value: 'webseite', label: 'Webseite'},
    {value: 'kommilitonen', label: 'Kommiliton:innen'},
    {value: 'ov', label: 'Orientierungsveranstaltung vom International Office'},
    {value: 'schreibcafe', label: 'Schreibcafé'},
    {value: 'sprachkurs', label: 'Durch meinen Sprachkurs (Deutsch im Studium, DSH, Studienkolleg)'},
    {value: 'lndah', label: 'Workshop bei der Langen Nacht der aufgeschobenen Hausarbeiten'},
    {value: 'austauschrunde', label: 'Austauschrunde vom International Office'}
  ];

  let terminReasonsCheckboxes = [
    {value: 'themaEntwickeln', label: 'Ich möchte mein Thema (weiter-)entwickeln.'},
    {value: 'feedback', label: 'Ich hätte gerne Feedback auf meinen Text.'},
    {value: 'anfangen', label: 'Ich brauche Tipps, um mit dem Schreiben anzufangen.'},
    {value: 'struktur', label: 'Ich möchte an der Struktur meines Textes arbeiten.'},
    {value: 'stil', label: 'Ich möchte den Stil meines Textes verbessern.'},
    {value: 'literatur', label: 'Ich möchte wissen, wie ich Literatur sammeln, auswerten und in meinen Text integrieren kann.'},
    {value: 'daf', label: 'Ich möchte mit Problemen in der Fremdsprache Deutsch umgehen.'},
    {value: 'dozEmpfehlung', label: 'Mein:e Dozent:in hat mir die Beratung empfohlen.'},
    {value: 'kritik', label: 'Meine letzte Arbeit wurde schlecht bewertet.'},
    {value: 'anforderungenUniText', label: 'Ich möchte wissen, wie ein Text an einer deutschen Hochschule aussehen soll.'},
    {value: 'sonstige', label: 'Sonstige Gründe.'}
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

  let languageOptions = [
    {value: 'Erstsprache', label: 'Erstsprache*'},
    {value: 'Eine von mehreren Erstsprachen', label: 'Eine von mehreren Erstsprachen'},
    {value: 'Zweitsprache', label: 'Zweitsprache*'},
    {value: 'Fremdsprache', label: 'Fremdsprache'}
  ];

  let genderOptions = [
    {value: 'Männlich', label: 'Männlich'},
    {value: 'Weiblich', label: 'Weiblich'},
    {value: 'Divers', label: 'Divers'},
    {value: 'Keine Angabe', label: 'Keine Angabe'}
  ];

  let firstGenerationOptions = [
    {value: 1, label: 'Ja'},
    {value: 0, label: 'Nein'}
  ];

  let genreOptions = [
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

  let formatOptions = [
    {value: 'Beratung per Videokonferenz', label: 'Online per Videokonferenz'},
    {value: 'Beratung am Campus Westend', label: 'In Präsenz am Campus Westend'}
  ];

  if (props.english) {

    errorMessage = "Please fill in these fields and make sure your e-mail is correct.";

    howDidYouFindUsCheckboxes = [
      {value: 'flyer', label: 'Flyer/poster'},
      {value: 'dozierende', label: 'Professor/teacher'},
      {value: 'webseite', label: 'Website'},
      {value: 'kommilitonen', label: 'Friends/colleagues'},
      {value: 'ov', label: 'Orientation event with the International Office'},
      {value: 'schreibcafe', label: 'Writing Café (Schreibcafé)'},
      {value: 'sprachkurs', label: 'My language class (Deutsch im Studium, DSH, Studienkolleg)'},
      {value: 'lndah', label: 'Workshop at the Long Night against Procrastination (LNDAH)'},
      {value: 'austauschrunde', label: 'Exchanges with the International Office'}
    ];

    terminReasonsCheckboxes = [
      {value: 'themaEntwickeln', label: 'I want to develop my topic.'},
      {value: 'feedback', label: 'I would like feedback on my text.'},
      {value: 'anfangen', label: 'I need advice on how to start writing.'},
      {value: 'struktur', label: 'I want to work on the structure of my text.'},
      {value: 'literatur', label: 'I want to know how to find literature, evaluate it and integrate it into my text.'},
      {value: 'stil', label: 'I want to improve the style of my text.'},
      {value: 'daf', label: 'I want to deal with problems with German as a foreign language.'},
      {value: 'dozEmpfehlung', label: 'My teacher/professor advised me to go.'},
      {value: 'kritik', label: 'I received negative feedback on previous texts.'},
      {value: 'anforderungenUniText', label: 'I want to learn more about the requirements of German academic texts.'},
      {value: 'sonstige', label: 'Other'}
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

    languageOptions = [
      {value: 'Erstsprache', label: 'First language*'},
      {value: 'Eine von mehreren Erstsprachen', label: 'One of multiple first languages'},
      {value: 'Zweitsprache', label: 'Second language*'},
      {value: 'Fremdsprache', label: 'Foreign language'}
    ];

    genderOptions = [
      {value: 'Männlich', label: 'Male'},
      {value: 'Weiblich', label: 'Female'},
      {value: 'Divers', label: 'Non-binary'},
      {value: 'Keine Angabe', label: 'NA'},
    ];

    firstGenerationOptions = [
      {value: 1, label: 'Yes'},
      {value: 0, label: 'No'}
    ];

    genreOptions = [
      {value: 'Hausarbeit', label: 'Research paper/Hausarbeit'},
      {value: 'Essay', label: 'Essay'},
      {value: 'Bachelorarbeit', label: "Bachelor's thesis"},
      {value: 'Masterarbeit', label: "Master's thesis"},
      {value: 'WHA', label: 'WHA'},
      {value: 'Expose', label: 'Exposé'},
      {value: 'Thesenpapier', label: 'Thesis paper'},
      {value: 'Portfolio', label: 'Portfolio'},
      {value: 'Bericht', label: 'Research or internship report'},
      {value: 'Dissertation', label: 'Dissertation'},
      {value: 'sonstiges', label: 'Other'}
    ];

    formatOptions = [
      {value: 'Beratung per Videokonferenz', label: 'Online video conference'},
      {value: 'Beratung am Campus Westend', label: 'In person at Campus Westend'}
    ];
  }

  return (
    <div>
      <h1>{props.english?"Writing consultation for German learners":"Schreibberatung (Deutsch als Fremdsprache)"}</h1>
      {props.english?
        <h3>To make an appointment, please fill out the following contact form. Your answers help us prepare for your consultation and will not be used for other purposes.</h3> :
        <h3>Füllen Sie bitte das folgende Kontaktformular aus, um einen Termin zu vereinbaren. Ihre Antworten helfen uns bei der Vorbereitung der Beratung und werden nicht anderweitig verwendet.</h3>
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
              placeholder: props.english ? 'First name':'Ihr Vorname',
              onChange: props.inputHandler
            }} />
          <Input
            inputtype='input'
            label={props.english ? 'Last name':'Nachname'}
            elementConfig={{
              id: 'lastName',
              type: 'text',
              value: props.rsInfo.lastName,
              placeholder: props.english ? 'Last name':'Ihr Nachname',
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
              <p>Nutzen Sie wenn möglich Ihre universitäre E-Mail-Adresse (@stud.uni-frankfurt.de), da es sonst zu Zustellungsproblemen (v.a. bei Outlook-Adressen) kommen kann.</p>
            }
        </div>

        <h2>{props.english?"Course of Study":"Studium"}</h2>
        <div className={styles.Study}>
          {props.english ?
            <p>Only specify the subject to which the consultation pertains.</p> :
            <p>Falls Sie mehrere Fächer studieren, geben Sie bitte nur das Fach an, in dem Sie die zu beratende Arbeit schreiben.</p>
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

        <h2>{props.english?"About You":"Über Sie"}</h2>
        <div className={styles.AboutForm}>
          <Input
            inputtype='select'
            id='deutschAls'
            label={props.english?'German is your:':'Deutsch ist Ihre:'}
            options={languageOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='gender'
            label={props.english?'Gender:':'Geschlecht:'}
            options={genderOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='erstStudierend'
            label={props.english?'Are you the first person in your immediate family attending university?':'Sind Sie in Ihrer (Kern-)Familie die erste Person, die studiert?'}
            options={firstGenerationOptions}
            onChange={props.inputHandler}/>

          {props.english ?
            <p>*Your "first language" is the language you started speaking in, while your "second language" describes a language you use in everyday life and are proficient in.</p> :
            <p>*Mit "Erstsprache" ist die erste Sprache gemeint, in der jemand angefangen hat zu sprechen. Eine "Zweitsprache" ist eine im Alltag verwendete Sprache, die man sehr gut beherrscht, die aber nicht der Erstsprache entspricht.</p>
          }
        </div>

        <h2>{props.english?"Writing Consultation":"Zur Schreibberatung"}</h2>

        <Input
          inputtype='checkboxes'
          id='terminReasons'
          label={props.english?'What are the reasons for your appointment?':'Warum kommen Sie in die Schreibberatung?'}
          options={terminReasonsCheckboxes}
          currentChecked={props.rsInfo.terminReasons}
          onChange={props.inputHandler}/>

        <div className={styles.Consultation}>
        <Input
          inputtype='select'
          id='genre'
          label={props.english?'Genre of your text:':'Um welche Textsorte geht es?'}
          options={genreOptions}
          onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='format'
            label={props.english?'What kind of consultation would you prefer?':'Wie würden Sie gerne beraten werden?'}
            options={formatOptions}
            onChange={props.inputHandler}/>
        </div>



        <Input
          inputtype='checkboxes'
          id='reachedBy'
          label={props.english?'How did you learn about writing consultations?':'Wie haben Sie von uns erfahren?'}
          options={howDidYouFindUsCheckboxes}
          currentChecked={props.rsInfo.reachedBy}
          onChange={props.inputHandler}/>

        <h2>{props.english?"Message your tutor":"Nachricht an Berater*in"}</h2>

        {props.english ?
          <p>You can upload a text of yours if you would like to receive feedback on it. Please note that we can only read up to six pages per consultation. If your text exceeds this length, use the comment field to tell us which parts you would like to be read.<br /><br /><em>For security reasons we only accept .pdf, .doc(x), or .odt files. Your text will be sent directly to the writing consultation of the ISZ and will not be saved on our servers.</em></p> :
          <p>Sie können hier einen Text hochladen, auf den Sie gerne Feedback erhalten möchten. In der Schreibberatung lesen wir maximal sechs Seiten pro Beratung. Falls Ihr Text länger ist, benennen Sie bitte im Kommentarfeld, welche Teile wir lesen sollen.<br /><br /><em>Aus Sicherheitsgründen akzeptieren wir nur .pdf, .doc(x) und .odt Dateien. Ihr Text wird direkt an die Schreibberatung des ISZ weitergeleitet und nicht auf unseren Servern gespeichert.</em></p>
        }

        <Input
          inputtype='file'
          label={props.english?'Your text (optional, max. 10 MB)':'Dein Text (optional, max. 10 MB)'}
          elementConfig={{
            id: 'textfile',
            type: 'file',
            onChange: props.inputHandler
          }}/>

        <div className={styles.SmallText}>
          <Input
            inputtype='textarea'
            label={props.english?'Comment (optional, max. 200 characters)':'Kommentar (optional, max. 200 Zeichen)'}
            elementConfig={{
              id: 'comment',
              type: 'text',
              maxLength: 200,
              value: props.rsInfo.comment,
              placeholder: props.english?'Is there anything else you would like to let us know?':'Gibt es sonst noch etwas, das wir wissen sollten?',
              onChange: props.inputHandler
            }} />
        </div>
        </form>
    </div>
  );
};

export default iszForm;
