import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import StatBox from '../../../components/Admin/Stats/StatBox';
import StatSearch from '../../../components/Admin/Stats/StatSearch';
import Modal from '../../../components/UI/Modal/Modal';
import Spinner from '../../../components/UI/Spinner/Spinner';

import AuxComp from '../../../hoc/AuxComp/AuxComp';

class StatsDisplayer extends Component {
  state = {
    loading: true,
    stats: [],
    timeframe: {
      'from_month':1,
      'from_year':2021,
      'to_month':6,
      'to_year':2021
    },
    selectedTypes: {
      "Alle":true,
      "Studierende (fachübergreifend)":false,
      "Studierende (englischsprachig)":false,
      "Studierende (Germanistik)":false,
      "Studierende (Ethnologie)":false,
      "Studierende (Textfeedback)":false,
      "Promovierende":false,
      "Promovierende (englischsprachig)":false
    },
    modalContent: null,
    error: null
  }

  backdropClickHandler = () => {
    this.setState({modalContent: null, loading: false});
  }

  inputHandler = (event) => {
    const currentTimeframe = {...this.state.timeframe};
    currentTimeframe[event.target.id] = event.target.value;
    this.setState({
      timeframe: currentTimeframe
    }, () => this.loadStats());
  };

  typeButtonHandler = type => {
    let currentTypes = {...this.state.selectedTypes};
    currentTypes[type] = !currentTypes[type];
    this.setState({"selectedTypes": currentTypes}, () => this.loadStats());
  }

  loadStats = () => {
    const url = '/admin/monthly-stats.php';
    const currentTypes = {...this.state.selectedTypes};
    const activeTypes = Object.keys(currentTypes).reduce(
      (typeList, key) => currentTypes[key]?typeList.concat(key):typeList, []);
    const payload = {
      jwt: this.props.token,
      ...this.state.timeframe,
      types: activeTypes
    }

    axios.post(url, payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({loading: false, stats: res.data.data});
        } else {
          this.setState({loading: false, modalContent: 'error', error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({loading: false, modalContent: 'error', error: err.message});
      })
  }

  componentDidMount () {
    this.loadStats();
  }

  render () {
    let toDisplay = null;
    switch (this.state.modalContent) {
      case 'success':
        toDisplay = (
          <AuxComp>
          <p>Die Anfrage wurde erfolgreich gesendet.</p>
          </AuxComp>
        );
        break;
      case 'error':
        toDisplay = (
          <AuxComp>
          <p>Beim Ausführen der Aktion ist ein Serverfehler aufgetreten: {this.state.error}</p>
          </AuxComp>
        );
        break;
      default:
        break;
    }

    return (
      <AuxComp>
        <Modal
          visible={this.state.modalContent}
          onBackdropClick={this.backdropClickHandler}>
          {toDisplay}
        </Modal>

        <h1 style={{textAlign: 'center'}}>Statistiken</h1>
        {this.state.loading ?
          <Spinner /> :
          <AuxComp>
            <StatBox stats={this.state.stats} />
            <StatSearch
              inputHandler={this.inputHandler}
              selectedTypes={this.state.selectedTypes}
              typeButtonHandler={this.typeButtonHandler} />
          </AuxComp>
        }
      </AuxComp>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token
  };
};

export default connect(mapStateToProps)(StatsDisplayer);
