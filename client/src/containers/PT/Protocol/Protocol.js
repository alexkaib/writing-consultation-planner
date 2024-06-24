import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import protocolConfig from '../../../protocol_config.json';

import FormDisplayer from '../../FormDisplayer/FormDisplayer';
import BigButton from '../../../components/UI/BigButton/BigButton';
import Spinner from '../../../components/UI/Spinner/Spinner';

class Protocol extends Component {
  constructor(props) {
    super(props);

    const initialProtocolInfo = {};

    protocolConfig.protocol_form.forEach(formElement => {
      if (formElement.type === 'heading') return;
      if (formElement.type === 'checkboxes') {
        const checkboxDict = {};
        formElement.options.forEach(option => {
          checkboxDict[option.value] = false;
        });
        initialProtocolInfo[formElement.db_name] = checkboxDict;
      } else if (formElement.type === 'select') {
        initialProtocolInfo[formElement.db_name] = formElement.options[0].value;
      } else {
        initialProtocolInfo[formElement.db_name] = null;
      }
    });

    this.state = {
      showModal: false,
      error: null,
      formInfo: initialProtocolInfo,
      invalidForm: false,
      //"updating" decides whether submitting the form leads to create- or update-request
      updating: false,
      protocolId: null,
      loading: true,
      successMessage: null
    }
  }

  updateFormInfo = (newInfo) => {
    this.setState({formInfo: newInfo});
  }

  submitHandler = () => {
    if (this.state.updating) {
      const payload = {
        protocolToUpdate: this.state.protocolId,
        protocolInfo: this.state.formInfo,
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
          this.setState({error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({error: err});
      })
    }

    else if (this.props.terminId) {

      const payload = {
        terminId: this.props.terminId,
        protocolInfo: this.state.formInfo,
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
            successMessage: 'Das Protokoll wurde erfolgreich abgespeichert. Du kannst es weiter bearbeiten oder zum Menü zurückkehren, um die Beratung zu archivieren.'
          });
        } else {
          this.setState({error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({error: err});
      })
    }
    else {
      console.log('Keine props-Daten empfangen');
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
            const newProtocolInfo = {...this.state.formInfo};
            const protocolData = res.data.protocolData;

            for (const [key, value] of Object.entries(newProtocolInfo)) {
              // no string means checkbox object, so unpack received string concat of checked options
              if (typeof value !== 'string' && value !== null) {
                protocolData[key].split('_').forEach(checkboxKey =>
                  newProtocolInfo[key][checkboxKey] = true
                );
              } else {
                newProtocolInfo[key] = protocolData[key];
              }
            }

            this.setState({
              formInfo: newProtocolInfo,
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
        toDisplay = (
          <>
          <FormDisplayer
            formStructure={protocolConfig.protocol_form}
            updateParentState={this.updateFormInfo}
            formInfo={this.state.formInfo}
            goBackHandler={null}
            submitHandler={null}/>
          <BigButton available buttonHandler={this.submitHandler}>Protokoll speichern</BigButton>
          </>
        )
      }
    }

    return (
      <>
        <h3 style={{color: 'green'}}>{this.state.successMessage}</h3>
        {toDisplay}
      </>
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
