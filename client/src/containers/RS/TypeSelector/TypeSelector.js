import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import config from '../../../config.json';

import TypeSelection from '../../../components/UI/TypeSelection/TypeSelection';

class TypeSelector extends Component {
  state = {
    consultationTypes: [],
    error: null
  }

  typeSelectionHandler = (consultationType) => {
    this.props.onTypeSelect(consultationType);
    this.props.history.push({pathname: '/rs/select-slot/'});
  }

  componentDidMount () {
    axios.get('/rs/available-types.php')
      .then(res => {
        if (res.data.success) {
          const types = res.data.types.map(type => ({
            id: type.id,
            audience: type.audience,
            label: {
              'en': type.name_en,
              'de': type.name_de
            }
          }));
          this.setState({consultationTypes: types});
        } else {
          this.setState({error: "Ein Server-Fehler ist aufgetreten: " + res.data.msg});
        }
      })
      .catch(err => {
        this.setState({error: "Ein Server-Fehler ist aufgetreten: " + err.message});
      })
  }

  render () {
    return (
      <>
      {this.state.error ? <p style={{color:'red'}}>{this.state.error}</p> :
      <TypeSelection
        audiences={config.audiences}
        consultationTypes={this.state.consultationTypes}
        buttonHandler={this.typeSelectionHandler}
        language={this.props.language} />
      }
      </>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTypeSelect: (consultationType) => dispatch({type: 'SELECT_TYPE', consultationType: consultationType})
  };
};

const mapStateToProps = (state) => {
  return {
    english: state.rs.english,
    language: state.rs.language
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TypeSelector));
