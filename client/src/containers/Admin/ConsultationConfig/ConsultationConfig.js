import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import config from '../../../config.json';
import langStrings from '../../../lang/languageStrings.json';

import TypeSelection from '../../../components/UI/TypeSelection/TypeSelection';
import TypeButton from '../../../components/UI/TypeSelection/TypeButton/TypeButton';

class ConsultationConfig extends Component {
  state = {
    consultationTypes: []
  }

  onTypeClick = typeId => {
    this.props.onTypeConfig(typeId);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.props.history.push('/pt/edit-consultation-type');
    return null;
  }

  addType = () => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    this.props.history.push('/pt/add-consultation-type');
    return null;
  }

  componentDidMount () {
    axios.get('/rs/available-types.php')
      .then(res => {
        const types = res.data.types.map(type => ({
          id: type.id,
          audience: type.audience,
          label: {
            'en': type.name_en,
            'de': type.name_de
          }
        }));
        this.setState({consultationTypes: types});
      })
      .catch(err => {
        console.log(err.message);
      })
  }

  render () {
    return (
      <>
      <TypeSelection
        audiences={config.audiences}
        consultationTypes={this.state.consultationTypes}
        buttonHandler={this.onTypeClick}
        language={this.props.language} />
      <div style={{display: 'flex', justifyContent: 'center'}}>
      <TypeButton buttonHandler={this.addType}>+ {langStrings[this.props.language].add_consultation_type}</TypeButton>
      </div>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTypeConfig: (typeId) => dispatch({type: 'EDIT_TYPE', typeId: typeId})
  }
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token,
    language: state.rs.language
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ConsultationConfig));
