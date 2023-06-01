import React from 'react';

import Input from '../UI/Input/Input';
import styles from './ConsentForm.module.css';

const consentForm = (props) => {
  const textContent = {
    h1: "Anmeldung zur Schreibberatung",
    explanation: "Um einen Termin zur Schreibberatung vereinbaren zu können, benötigen wir deine Kontaktdaten und Angaben zu deinem Studium. In der folgenden Datenschutzerklärung erfährst du, wie wir mit diesen Daten umgehen (v.a. unter dem Punkt \"Umgang mit personenbezogenen Daten\"):",
    confirm: "Bestätigen",
    acceptLabel: "Ich stimme dem beschriebenen Umgang mit meinen Daten zu."
  }
  if (props.english) {
    textContent["h1"] = "Register for a Writing Consultation";
    textContent["explanation"] = "We need your contact data and some additional information about your course of study to register an appointment for you. Please read the following privacy notice carefully to learn how we use this information.";
    textContent.confirm = "Confirm";
    textContent.acceptLabel = "I agree to the above terms."
  }
  return (
    <div className={styles.ConsentForm}>
      <h1>{textContent.h1}</h1>
      <p>{textContent.explanation}</p>
      <div className={styles.Terms}>
        <p>Diese Datenschutzerklärung dient zur Erfüllung der nach Artikel 13 EU DSGVO geforderten Informationspflicht bei der Erhebung von Daten zum Zeitpunkt der Erhebung bei betroffenen Personen.</p>
        <h3>Name und Anschrift des Verantwortlichen</h3>
        <p>Johann Wolfgang Goethe-Universität Frankfurt am Main<br/>Theodor-W.-Adorno-Platz 1<br/>60323 Frankfurt</p>

        <p>Postanschrift:<br/>Goethe-Universität Frankfurt am Main<br/>60629 Frankfurt</p>

        <p>Telefon: +49-69-798-0 | Fax: +49-69-798-18383<br/>Internet: www.uni-frankfurt.de</p>
        <p>Bei Anfragen oder Beschwerden zum Datenschutz können Sie sich mit den Datenschutzbeauftragten der Goethe-Universität in Verbindung setzen.</p>

        <h3>Kontaktdaten der Datenschutzbeauftragen</h3>
        <p>Johann Wolfgang Goethe-Universität Frankfurt am Main<br/>Die behördlichen Datenschutzbeauftragten<br/>Theodor-W.-Adorno-Platz 1<br/>60323 Frankfurt<br/>Internet: <a href="http://www.uni-frankfurt.de/47859992/datenschutzbeauftragte" target="_blank" rel="noopener noreferrer"> http://www.uni-frankfurt.de/47859992/datenschutzbeauftragte</a><br/>E-Mail: dsb@uni-frankfurt.de</p>

        <h3>Rechte und Beschwerdemöglichkeiten</h3>
        <p>Sie haben das Recht sich bei datenschutzrechtlichen Problemen bei der zuständigen Fachaufsichtsbehörde zu beschweren.</p>
        <p>Kontaktadresse der Fachaufsichtsbehörde der Goethe-Universität Frankfurt am Main:</p>

        <p>Der Hessische Datenschutzbeauftragte<br/>Postfach 3163<br/>65021 Wiesbaden<br/>Telefon: +49-611-1408-0 | Telefax: +49-611-1408-611<br/>E-Mail an HDSB (Link zum Kontaktformular des Hessischen Datenschutzbeauftragten: <a href="https://datenschutz.hessen.de/%C3%BCber-uns/kontakt" target="_blank" rel="noopener noreferrer">https://datenschutz.hessen.de/%C3%BCber-uns/kontakt</a>)</p>
        <p>Sie haben gegenüber der Goethe-Universität folgende Rechte hinsichtlich Ihrer gespeicherten personenbezogenen Daten:</p>
        <ul style={{textAlign: 'left'}}>
            <li>Recht auf Auskunft,</li>
            <li>Recht auf Berichtigung oder Löschung,</li>
            <li>Recht auf Einschränkung der Verarbeitung,</li>
            <li>Recht auf Widerruf Ihrer Einwilligung,</li>
            <li>Recht auf Widerspruch gegen die Verarbeitung,</li>
            <li>Recht auf Datenübertragbarkeit, in einer gängigen, strukturierten und maschinenlesbaren Form (ab dem 25. Mai 2018)</li>
        </ul>
        <p>Zur Geltendmachung dieser Rechte wenden Sie sich an <a href="mailto:akaib@em.uni-frankfurt.de">Alexander Kaib</a>.</p>

        <h3>Art der gespeicherten Daten, Zweck und Rechtgrundlagen, Löschungsfristen</h3>
        <h4>Umgang mit personenbezogenen Daten</h4>
        <p>Personenbezogene Daten sind Informationen, mit deren Hilfe eine natürliche Person bestimmbar ist, also Angaben, durch die Personen identifizierbar sind. Dazu gehören insbesondere Namen, E-Mail-Adressen, Matrikelnummern oder Telefonnummern. Aber auch Daten über Vorlieben, Hobbies, Mitgliedschaften oder auch Informationen über Webseiten, die aufgesucht wurden, zählen zu personenbezogenen Daten. </p>

        <p>Bei der Anmeldung zu Schreibberatungen werden personenbezogene Daten zum Zweck der Kontaktaufnahme erhoben. Diese Daten werden gespeichert und können von den zuständigen Berater*innen abgerufen werden. Falls keine Folgeberatung vereinbart wird, werden diese Daten nach der stattgefundenen Beratung gelöscht.</p>

        <p>Im Anschluss an Schreibberatungen kann aus Forschungs- und Weiterbildungszwecken ein Beratungsprotokoll geschrieben werden, das Informationen über den Verlauf der Beratung enthält. Möglicherweise kann es sich dabei um im Beratungsgespräch erwähnte personenbezogene Daten handeln, falls diese für das Verständnis des Verlaufs notwendig sind. Dieses Protokoll wird zusammen mit den bei der Anmeldung erhobenen statistischen Daten für maximal 10 Jahre gespeichert.</p>

        <p>Die Nutzung personenbezogener Daten der Studierenden zum Zwecke des Studiums basieren weitestgehend auf dem geltenden Hessischen Hochschulgesetz in Verbindung mit der geltenden Immatrikulationsverordnung des Landes Hessen und beziehen sich somit auf EU DSGVO Artikel 6 Absatz 1 c).</p>

        <p>Die Daten der Beschäftigten der Goethe-Universität zum Zwecke der Personalverwaltung, der Lehr-, Forschungs- und Prüfungstätigkeiten werden auf Basis des Hessischen Hochschulgesetzes, der Immatrikulationsverordnung des Landes Hessen, TV-G-U, beamtenrechtlicher und personalrechtlicher Regelungen erhoben und verarbeitet.</p>

        <h4>Zugriffsdaten/Server-Logdateien</h4>
        <p> Beim Zugriff auf die Seiten dieses Webservers werden im Allgemeinen folgende Daten in den Server-Logfiles gespeichert</p>

        <ol style={{textAlign: 'left'}}>
        <li> IP-Adresse</li>
        <li> Datum und Uhrzeit</li>
        <li> Typ des Client Browsers</li>
        <li> URL der aufgerufenen Seite</li>
        <li> Gegebenenfalls die Fehlermeldung der aufgetretenen Fehler</li>
        <li> Gegebenenfalls der anfragende Provider</li>
        </ol>

        <p> Diese Daten dienen ausschließlich zum Zwecke der Kontrolle der Funktionalität, der Sicherheit und Fehlerbehebung. Die Nutzung basiert auf EU DSGVO Artikel 6 Absatz 1 f). Alle Logdateien werden automatisiert nach spätestens 7 Tagen gelöscht oder anonymisiert.</p>

        <h4>Kontaktaufnahme</h4>
        <p>Zur Kontaktaufnahme mit Mitarbeitenden des Schreibzentrums (zum Beispiel per Kontaktformular oder E-Mail) werden Ihre Angaben zwecks Bearbeitung der Anfrage sowie für den Fall, dass Anschluss­fragen entstehen, gespeichert. Nach Bearbeitung Ihres Anliegens bzw. nach Erfüllung der Rechtspflicht oder des genutzten Dienstes werden die Daten gelöscht, es sei denn, die Aufbewahrung der Daten ist zur Umsetzung berechtigter Interessen der Goethe Universität oder auf Grund einer gesetzlichen Vorschrift (z.B. Gesetz, Rechtsverordnung, Satzung der Goethe Universität etc.) erforderlich.</p>

      </div>
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <div style={{width: '350px'}}>
      <Input
        inputtype='checkboxes'
        options={[{label: textContent.acceptLabel, value: 'termsAccepted'}]}
        currentChecked={{termsAccepted: props.accepted}}
        onChange={props.inputHandler} />
      </div>
      </div>
      <div className={styles.AcceptTermsButton}>
          <button
            className={props.accepted?styles.available:styles.unavailable}
            onClick={props.accepted?props.acceptTermsHandler:null}>
            {textContent.confirm}
          </button>
      </div>
    </div>
  );
};

export default consentForm;
