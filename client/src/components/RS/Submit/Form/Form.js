import React from 'react';

import Input from '../../../UI/Input/Input';
import DisclosureButton from '../../../UI/DisclosureButton/DisclosureButton';
import styles from './Form.module.css';

const form = props => {

  let errorMessage = "Bitte fülle diese Felder vollständig aus und überprüfe deine E-Mail.";
  let additionalInfoLabel = "Warum fragen wir das?";
  let additionalInfoText = "Die folgenden Fragen dienen ausschließlich" +
   " statistischen Zwecken und haben keinen Einfluss auf deine Beratung." +
   " Als fachübergreifende Einrichtung, die vor allem durch Projektmittel finanziert wird," +
   " muss das Schreibzentrum regelmäßig Bericht darüber erstatten, welche demographischen Gruppen" +
   " durch unsere Angebote erreicht werden. Diese Daten helfen uns, unser Fortbestehen zu sichern," +
   " sind aber natürlich trotzdem freiwillig. Falls du die Fragen nicht beantworten willst," +
   " wähle bitte 'Keine Angabe' aus."

  let howDidYouFindUsCheckboxes = [
    {value: 'flyer', label: 'Flyer/Poster'},
    {value: 'dozierende', label: 'Dozierende'},
    {value: 'socialMedia', label: 'Social Media'},
    {value: 'webseite', label: 'Webseite'},
    {value: 'kommilitonen', label: 'Kommiliton:innen'},
    {value: 'ov', label: 'Orientierungsveranstaltung'},
    // added 2022-10-21
    {value: 'email', label: 'E-Mail des Schreibzentrums / Uni-Rundmail'},
    {value: 'sz', label: 'Andere Veranstaltung des Schreibzentrums (z.B. Seminartraining, Workshop...)'}
  ];

  let terminReasonsCheckboxes = [
    {value: 'themaEntwickeln', label: 'Ich möchte mein Thema (weiter-)entwickeln.'},
    {value: 'feedback', label: 'Ich hätte gerne Feedback auf meinen Text.'},
    {value: 'anfangen', label: 'Ich brauche Tipps, um mit dem Schreiben anzufangen.'},
    {value: 'struktur', label: 'Ich möchte an der Struktur meines Textes arbeiten.'},
    {value: 'unsicher', label: 'Ich habe allgemeine Unsicherheiten beim Schreiben.'},
    {value: 'dozEmpfehlung', label: 'Mein:e Dozent:in hat mir die Beratung empfohlen.'},
    {value: 'kritik', label: 'Meine letzte Arbeit wurde schlecht bewertet.'},
    {value: 'formales', label: 'Ich habe Schwierigkeiten mit formalen Aspekten wie Zitation, Stil und Grammatik.'},
    {value: 'ki', label: 'Ich möchte mich über die Nutzung von KI-Tools wie ChatGPT informieren.'},
    {value: 'daf', label: 'Ich lerne Deutsch als Fremdsprache und hätte gerne Tipps zum Schreiben.*'},
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
    // added 2022-10-21
    {value: 'staatsexamen', label: 'Staatsexamen'},
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

  let languageOptions = [
    {value: 'Erstsprache', label: 'Erstsprache*'},
    {value: 'Eine von mehreren Erstsprachen', label: 'Eine von mehreren Erstsprachen'},
    {value: 'Zweitsprache', label: 'Zweitsprache*'},
    {value: 'Fremdsprache', label: 'Fremdsprache'},
    {value: 'Keine Angabe', label: 'Keine Angabe'}
  ];

  let genderOptions = [
    {value: 'Männlich', label: 'Männlich'},
    {value: 'Weiblich', label: 'Weiblich'},
    {value: 'Divers', label: 'Divers'},
    {value: 'Keine Angabe', label: 'Keine Angabe'}
  ];

  let firstGenerationOptions = [
    {value: 1, label: 'Ja'},
    {value: 0, label: 'Nein'},
    {value: 'Keine Angabe', label: 'Keine Angabe'}
  ];

  let parentsOptions = [
    {value: 'beide in Deutschland', label: 'beide in Deutschland'},
    {value: 'ein Elternteil im Ausland', label: 'ein Elternteil im Ausland'},
    {value: 'beide Elternteile im Ausland', label: 'beide Elternteile im Ausland'},
    {value: 'Keine Angabe', label: 'Keine Angabe'}
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

  if (props.english) {

    errorMessage = "Please fill in these fields and make sure your e-mail is correct.";
    additionalInfoLabel = "Why do we need to know?";
    additionalInfoText = "The following questions serve purely statistical purposes" +
     " and will not impact your writing consultation in any way. We ask them" +
     " because the Writing Center is an interdisciplinary institution that is largely financed" +
     " by government and third-party funds. As such, we are required to report which" +
     " groups of students we reach. Your answers help secure our continued existence," +
     " but are of course voluntary. If you do not want to answer these questions," +
     " please select 'not applicable'.";

    howDidYouFindUsCheckboxes = [
      {value: 'flyer', label: 'Flyer/poster'},
      {value: 'dozierende', label: 'Professor/teacher'},
      {value: 'socialMedia', label: 'Social Media'},
      {value: 'webseite', label: 'Website'},
      {value: 'kommilitonen', label: 'Friends/colleagues'},
      {value: 'ov', label: 'Orientation week/other discipline-specific event'},
      {value: 'email', label: 'E-Mail by the Writing Center/university'},
      {value: 'sz', label: 'Other Writing Center event (e.g. in-class-training, workshop, LNDAH...)'}
    ];

    terminReasonsCheckboxes = [
      {value: 'themaEntwickeln', label: 'I want to develop my topic.'},
      {value: 'feedback', label: 'I would like feedback on my text.'},
      {value: 'anfangen', label: 'I need advice on how to start writing.'},
      {value: 'struktur', label: 'I want to work on the structure of my text.'},
      {value: 'unsicher', label: 'I feel insecure about my writing.'},
      {value: 'dozEmpfehlung', label: 'My teacher/professor advised me to go.'},
      {value: 'kritik', label: 'I received negative feedback on previous texts.'},
      {value: 'formales', label: 'I have difficulties regarding formal elements of writing, such as grammar, style and citation rules.'},
      {value: 'ki', label: 'I would like advice on using AI tools like ChatGPT in the writing process.'},
      {value: 'daf', label: 'I am learning German as a second language and need tips on how to write better.*'},
      {value: 'sonstige', label: 'Other'}
    ];

    abschlussOptions = [
      {value: 'bachelor', label: 'Bachelor'},
      {value: 'master', label: 'Master'},
      {value: 'lehramt', label: 'Teaching degree'},
      {value: 'staatsexamen', label: 'Staatsexamen'},
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
      {value: 'Fremdsprache', label: 'Foreign language'},
      {value: 'Keine Angabe', label: 'Not applicable'}
    ];

    genderOptions = [
      {value: 'Männlich', label: 'Male'},
      {value: 'Weiblich', label: 'Female'},
      {value: 'Divers', label: 'Non-binary'},
      {value: 'Keine Angabe', label: 'Not applicable'}
    ];

    firstGenerationOptions = [
      {value: 1, label: 'Yes'},
      {value: 0, label: 'No'},
      {value: 'Keine Angabe', label: 'Not applicable'}
    ];

    parentsOptions = [
      {value: 'beide in Deutschland', label: 'both in Germany'},
      {value: 'ein Elternteil im Ausland', label: 'one parent outside of Germany'},
      {value: 'beide Elternteile im Ausland', label: 'both parents outside of Germany'},
      {value: 'Keine Angabe', label: 'Not applicable'}
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
  }

  return (
    <div>
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
          <div style={{width: '100%'}}>
          {props.english ?
            <p>Only specify the subject to which the consultation pertains.</p> :
            <p>Falls du mehrere Fächer studierst, gib bitte nur das Fach an, in dem du die zu beratende Arbeit schreibst.</p>
          }
          </div>
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

        <h2>{props.english?"About You":"Über dich"}</h2>

        <DisclosureButton label={additionalInfoLabel} mainText={additionalInfoText}/>

        <div className={styles.AboutForm}>
          <Input
            inputtype='select'
            id='deutschAls'
            label={props.english?'German is your:':'Deutsch ist deine:'}
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
            label={props.english?'Are you the first person in your immediate family attending university?':'Bist du in deiner (Kern-)Familie die erste Person, die studiert?'}
            options={firstGenerationOptions}
            onChange={props.inputHandler}/>

          <Input
            inputtype='select'
            id='elternHerkunft'
            label={props.english?'Where were your parents born?:':'Wo sind deine Eltern geboren?'}
            options={parentsOptions}
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
          label={props.english?'What are the reasons for your appointment?':'Was bringt dich zur Schreibberatung?'}
          options={terminReasonsCheckboxes}
          currentChecked={props.rsInfo.terminReasons}
          onChange={props.inputHandler}/>

        {props.english ?
          <p>*Since we are not trained in language acquisition, you might want to consider a <a href="https://www.uni-frankfurt.de/43665699/Schreibberatung" target="_blank" rel="noreferrer">writing consultation with the ISZ</a>.</p> :
          <p>*Darauf sind wir nicht spezialisiert, deshalb ist eine <a href="https://www.uni-frankfurt.de/43665699/Schreibberatung" target="_blank" rel="noreferrer">Schreibberatungen beim ISZ</a> oft hilfreicher.</p>}

        <div className={styles.Study}>
        <Input
          inputtype='select'
          id='genre'
          label={props.english?'Genre of your text:':'Um welche Textsorte geht es?'}
          options={genreOptions}
          onChange={props.inputHandler}/>
        </div>

        <Input
          inputtype='checkboxes'
          id='reachedBy'
          label={props.english?'How did you learn about writing consultations?':'Wie hast du von uns erfahren?'}
          options={howDidYouFindUsCheckboxes}
          currentChecked={props.rsInfo.reachedBy}
          onChange={props.inputHandler}/>

        <h2>{props.english?"Message your tutor":"Nachricht an Berater*in"}</h2>

        {props.english ?
          <p>You can upload a text of yours if you would like to receive feedback on it. Please note that our tutors can only read up to seven pages per consultation. If your text exceeds this length, use the comment field to tell your tutor which parts you would like to be feedbacked.<br /><br /><em>For security reasons we only accept .pdf, .doc(x), or .odt files. Your text will be sent directly to your tutor and will not be saved on our servers.</em></p> :
          <p>Du kannst hier einen Text hochladen, auf den du gerne Feedback erhalten möchtest. Bitte beachte, dass unsere Berater:innen maximal sieben Seiten pro Beratung lesen. Falls dein Text länger ist, beschreib bitte im Kommentarfeld, welche Teile gelesen werden sollen.<br /><br /><em>Aus Sicherheitsgründen akzeptieren wir nur .pdf, .doc(x) und .odt Dateien. Dein Text wird direkt an deine:n Berater:in weitergeleitet und nicht auf unseren Servern gespeichert.</em></p>
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

export default form;
