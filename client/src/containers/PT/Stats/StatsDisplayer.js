import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import StatBox from '../../../components/Admin/Stats/StatBox';
import StatSearch from '../../../components/Admin/Stats/StatSearch';
import DBExport from '../../../components/Admin/Stats/DBExport';
import Modal from '../../../components/UI/Modal/Modal';
import Spinner from '../../../components/UI/Spinner/Spinner';


class StatsDisplayer extends Component {
  // the names of the database tables that can be exported by user
  dbTables = [
    'ratsuchende',
    'termine',
    'protocols',
    'peerTutors'
  ];

  constructor(props) {
    super(props);

    const currentYear = new Date().getFullYear();

    this.state = {
      loading: true,
      consultationTypes: [],
      stats: [],
      timeframe: {
        'from_month':1,
        'from_year':currentYear,
        'to_month':6,
        'to_year':currentYear
      },
      selectedType: -1,
      modalContent: null,
      error: null
    }
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
    this.setState({"selectedType": type}, () => this.loadStats());
  }

  exportButtonHandler = tableName => {
    const url = '/admin/db-export.php';
    const payload = {
      jwt: this.props.token,
      tableName: tableName
    }

    axios.post(url, payload, {responseType: 'blob'})
      .then(res => {
        // create file link in browser's memory
        const href = URL.createObjectURL(res.data);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'export.csv'); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch(err => {
        this.setState({loading: false, modalContent: 'error', error: err.message});
      })
  }

  loadStats = () => {
    const url = '/admin/monthly-stats.php';
    const currentType = this.state.selectedType;
    const payload = {
      jwt: this.props.token,
      ...this.state.timeframe,
      type: currentType
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

  loadTypes = () => {
    const url = '/rs/available-types.php';

    axios.get(url)
      .then(res => {
        if (res.data.success === 1) {
          const types = res.data.types;
          types.splice(0, 0, {id: -1, name_de: 'Alle', name_en: 'All', audience: ''});
          this.setState({consultationTypes: res.data.types});
        } else {
          this.setState({loading: false, modalContent: 'error', error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({loading: false, modalContent: 'error', error: err.message});
      })
  }

  componentDidMount () {
    this.loadTypes();
    this.loadStats();
  }

  render () {
    let toDisplay = null;
    switch (this.state.modalContent) {
      case 'success':
        toDisplay = (
          <p>Die Anfrage wurde erfolgreich gesendet.</p>
        );
        break;
      case 'error':
        toDisplay = (
          <p>Beim Ausführen der Aktion ist ein Serverfehler aufgetreten: {this.state.error}</p>
        );
        break;
      default:
        break;
    }

    return (
      <>
        <Modal
          visible={this.state.modalContent}
          onBackdropClick={this.backdropClickHandler}>
          {toDisplay}
        </Modal>

        <h1 style={{textAlign: 'center'}}>Statistiken</h1>
        {this.state.loading ?
          <Spinner /> :
          <>
            <StatBox stats={this.state.stats} />
            <StatSearch
              inputHandler={this.inputHandler}
              availableTypes={this.state.consultationTypes}
              selectedType={this.state.selectedType}
              typeButtonHandler={this.typeButtonHandler}
              language={this.props.language} />
            <DBExport
              dbTables={this.dbTables}
              exportButtonHandler={this.exportButtonHandler}
              language={this.props.language} />
          </>
        }
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token,
    language: state.rs.language
  };
};

export default connect(mapStateToProps)(StatsDisplayer);
