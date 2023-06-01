import React from 'react';

import Input from '../../UI/Input/Input';
import styles from './ProtocolForm.module.css';

const protocolForm = (props) => {
  const binaryOptions = [
    {value: 1, label: 'Ja'},
    {value: 0, label: 'Nein'}
  ]

  const topicOptions = [
    {value: 'Recherche', label: 'Recherche'},
    {value: 'Schreibprozess', label: 'Schreibprozess'},
    {value: 'Leseprozess', label: 'Leseprozess'},
    {value: 'Themenfindung', label: 'Themenfindung'},
    {value: 'Fragestellung', label: 'Fragestellung'},
    {value: 'StrukturundGliederung', label: 'Struktur und Gliederung'},
    {value: 'Argumentation', label: 'Argumentation'},
    {value: 'SpracheundStil', label: 'Sprache und Stil'},
    {value: 'Wissenschaftlichkeit', label: 'Wissenschaftlichkeit'},
    {value: 'Zitieren', label: 'Zitieren'},
    {value: 'Formales', label: 'Formales'},
    {value: 'ArbeitsundZeitorganisation', label: 'Arbeits- und Zeitorganisation'},
    {value: 'Dozierendenkommunikation', label: 'Dozierendenkommunikation'},
    {value: 'AllgemeineInformationundStudienorganisation', label: 'Allgemeine Information und Studienorganisation'},
    {value: 'KI-Tools', label: 'KI-Tools (ChatGPT, DeepL, etc.)'},
  ];

  const writingPhaseOptions = [
    {value: 'VorbereitenPlanen', label: 'Vorbereiten/Planen'},
    {value: 'Lesen', label: 'Lesen'},
    {value: 'Schreiben', label: 'Schreiben'},
    {value: 'Überarbeiten', label: 'Überarbeiten'}
  ];

  return (

    <div className={styles.Form}>
    <h1>Schreibberatungsprotokoll</h1>
    <p>Achtung: Eingaben werden erst beim Drücken des "Speichern"-Buttons übernommen.
    Gespeicherte Protokolle können jederzeit unter dem Menüpunkt "Protokolle" eingesehen und verändert werden.</p>
      <h2>Beratungsinformationen</h2>

      <div className={styles.MediumSelect}>
      <Input
        inputtype='select'
        id='stattgefunden'
        label='Ratsuchende*r erschienen?'
        options={binaryOptions}
        onChange={props.inputHandler}/>
      </div>

      <Input
        inputtype='checkboxes'
        id='topics'
        label='Beratungsschwerpunkte (Mehrfachnennung möglich):'
        options={topicOptions}
        currentChecked={props.protocolInfo.topics}
        onChange={props.inputHandler}/>

      <Input
        inputtype='checkboxes'
        id='writingPhase'
        label='Schreibphase (Mehrfachnennung möglich):'
        options={writingPhaseOptions}
        currentChecked={props.protocolInfo.writingPhase}
        onChange={props.inputHandler}/>

      <h2>Verlauf</h2>
      <div className={styles.BigText}>
      <Input
        inputtype='textarea'
        label='Bitte nenne immer Anlass, Anliegen und Auftrag.'
        elementConfig={{
          id: 'proceedings',
          type: 'text',
          value: props.protocolInfo.proceedings,
          placeholder: 'Beschreibe den Verlauf der Beratung.',
          onChange: props.inputHandler
        }} />
      </div>

      <h2>Reflexion</h2>
      <div className={styles.MediumText}>
      <Input
        inputtype='textarea'
        label='1. Allgemein'
        elementConfig={{
          id: 'reflectionGeneral',
          type: 'text',
          value: props.protocolInfo.reflectionGeneral,
          placeholder: 'Wie war die Beratungssituation insgesamt? (Raum, Atmosphäre, etc.)',
          onChange: props.inputHandler
        }} />
      </div>

      <div className={styles.MediumText}>
      <Input
        inputtype='textarea'
        label='2. Methoden'
        elementConfig={{
          id: 'reflectionMethods',
          type: 'text',
          value: props.protocolInfo.reflectionMethods,
          placeholder: 'An welchem Punkt im Beratungsprozess war welche Methode nützlich? (Das kann sich sowohl aufGesprächstechniken als auch auf Schreibmethoden beziehen.)',
          onChange: props.inputHandler
        }} />
      </div>

      <div className={styles.MediumText}>
      <Input
        inputtype='textarea'
        label='3. Ich als Berater*in'
        elementConfig={{
          id: 'reflectionPersonal',
          type: 'text',
          value: props.protocolInfo.reflectionPersonal,
          placeholder: 'Wie ging es mir selbst bei der Beratung? Was war gut? Was hätte ich besser machenkönnen? Welche Beratungsstrategien hätte ich anwenden können?',
          onChange: props.inputHandler
        }} />
      </div>

      <div className={styles.SmallText}>
      <Input
        inputtype='textarea'
        label='Arbeitsvereinbarung'
        elementConfig={{
          id: 'workAgreement',
          type: 'text',
          value: props.protocolInfo.workAgreement,
          placeholder: 'Auf welche weiteren Schritte habt ihr euch geeinigt?',
          onChange: props.inputHandler
        }} />
      </div>

      <div className={styles.SubmitButton}>
        <div
          onClick={props.submitHandler}>
          Speichern
        </div>
      </div>

    </div>
  )
}

export default protocolForm;
