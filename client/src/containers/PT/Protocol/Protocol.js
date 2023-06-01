import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import ProtocolForm from '../../../components/PT/ProtocolForm/ProtocolForm';
import Spinner from '../../../components/UI/Spinner/Spinner';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

class Protocol extends Component {
  state = {
    //"updating" decides whether submitting the form leads to create- or update-request
    updating: false,
    protocolId: null,
    loading: true,
    error: null,
    successMessage: null,
    protocolInfo: {
      stattgefunden: 1,
      topics: {
        Recherche: false,
        Schreibprozess: false,
        Leseprozess: false,
        Themenfindung: false,
        Fragestellung: false,
        StrukturundGliederung: false,
        Argumentation: false,
        SpracheundStil: false,
        Wissenschaftlichkeit: false,
        Zitieren: false,
        Formales: false,
        ArbeitsundZeitorganisation: false,
        Dozierendenkommunikation: false,
        AllgemeineInformationundStudienorganisation: false
      },
      writingPhase: {
        VorbereitenPlanen: false,
        Lesen: false,
        Schreiben: false,
        Überarbeiten: false
      },
      proceedings: '',
      reflectionGeneral: '',
      reflectionMethods: '',
      reflectionPersonal: '',
      workAgreement: ''
    }
  }

  inputHandler = (event) => {
    const currentInfo = {...this.state.protocolInfo};

    switch (event.target.type) {
      case 'text':
      case 'email':
      case 'select-one':
        currentInfo[event.target.id] = event.target.value;
        this.setState({
          protocolInfo: currentInfo
        });
        break;

      case 'checkbox':
        const checkboxesName = event.target.parentElement.parentElement.id;
        const clickedBox = event.target.value;
        const updatedCheckboxes = currentInfo[checkboxesName];
        updatedCheckboxes[clickedBox] = !updatedCheckboxes[clickedBox];
        currentInfo[checkboxesName] = updatedCheckboxes;
        this.setState({
          protocolInfo: currentInfo
        });
        break;

      default:
      currentInfo[event.target.id] = event.target.value;
      this.setState({
        protocolInfo: currentInfo
      });
    }
  };

  submitHandler = () => {
    if (this.state.updating) {
      const payload = {
        protocolToUpdate: this.state.protocolId,
        protocolInfo: this.state.protocolInfo,
        jwt: this.props.token
      };

      axios.post('/pt/update-protocol.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0;
          this.setState({
            successMessage: 'Deine Änderungen am Protokoll wurden erfolgreich übernommen.'
          })
        } else {
          console.log(res)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }

    else if (this.props.terminId) {

      const payload = {
        terminId: this.props.terminId,
        protocolInfo: this.state.protocolInfo,
        jwt: this.props.token
      };

      axios.post('/pt/create-protocol.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          document.body.scrollTop = 0;
          document.documentElement.scrollTop = 0;
          this.setState({
            updating: true,
            protocolId: res.data.protocolId,
            successMessage: 'Das Protokoll wurde erfolgreich abgespeichert. Du kannst es weiter bearbeiten oder zum Menü zurückkehren, um die Beratung zu archivieren.'})
        } else {
          console.log(res)
        }
      })
      .catch(err => {
        console.log(err)
      })

    }

    else {
      console.log('Keine props-Daten empfangen')
    }
  }

  //checks if component was given an id, i.e. opened with viewing/updating in mind
  //if so, gets existing data from server and sets state so that submitting the form leads to updating the data
  //if not, loads the default of creating a new protocol on submit
  componentDidMount () {
    if (this.props.protocolId) {
      const protocolId = String(this.props.protocolId);
      const url = '/pt/get-protocol.php?protocolId=' + protocolId;
      const auth = {
        jwt: this.props.token
      }
      axios.post(url, auth)
        .then(res => {
          if (res.data.success === 1) {
            const newProtocolInfo = {...this.state.protocolInfo};
            const protocolData = res.data.protocolData;

            if (protocolData.Beratungsschwerpunkt) {
              const topicString = protocolData.Beratungsschwerpunkt;
              let newTopics = topicString.split('_').reduce((val, topic) => ({...val, [topic]: true}), {});
              newProtocolInfo['topics'] = newTopics;
            }
            if (protocolData.Schreibphase) {
              const phaseString = protocolData.Schreibphase;
              let newPhases = phaseString.split('_').reduce((val, phase) => ({...val, [phase]: true}), {});
              newProtocolInfo['writingPhase'] = newPhases;
            }
            if (protocolData.Verlauf) {
              newProtocolInfo['proceedings'] = protocolData.Verlauf;
            }
            if (protocolData.ReflexionAllgemein) {
              newProtocolInfo['reflectionGeneral'] = protocolData.ReflexionAllgemein;
            }
            if (protocolData.ReflexionMethode) {
              newProtocolInfo['reflectionMethods'] = protocolData.ReflexionMethode;
            }
            if (protocolData.ReflexionPersoenlich) {
              newProtocolInfo['reflectionPersonal'] = protocolData.ReflexionPersoenlich;
            }
            if (protocolData.Arbeitsvereinbarung) {
              newProtocolInfo['workAgreement'] = protocolData.Arbeitsvereinbarung;
            }
            this.setState({
              protocolInfo: newProtocolInfo,
              updating: true,
              protocolId: protocolData.protocolId,
              loading: false
            });
          } else {
            this.setState({error: 'Beim Laden des Protokolls ist ein Fehler aufgetreten. Bitte versuche es erneut. Fehler: ' + res.data.msg});
          }

        })
        .catch(err => {
          this.setState({error: 'Beim Laden des Protokolls ist ein Serverfehler aufgetreten. Bitte versuche es erneut.'});
        })
    }
    else {
      this.setState({loading: false});
    }
  }

  render() {
    let toDisplay = <p>Bitte logge dich ein, um auf diese Seite zuzugreifen.</p>;
    if (this.props.loggedIn) {
      toDisplay = <Spinner />;
      if (this.state.error) {
        toDisplay = <p>{this.state.error}</p>;
      }
      else if (!this.state.loading) {
        toDisplay = (<ProtocolForm
          protocolInfo={this.state.protocolInfo}
          inputHandler={this.inputHandler}
          submitHandler={this.submitHandler} />)
      }
    }

    return (
      <AuxComp>
        <h3 style={{color: 'green'}}>{this.state.successMessage}</h3>
        {toDisplay}
      </AuxComp>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    protocolId: state.pt.protocolId,
    terminId: state.pt.terminId,
    token: state.pt.token
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Protocol);
