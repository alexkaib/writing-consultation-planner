import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import langStrings from '../../../lang/languageStrings.json';
import config from '../../../config.json';

class RSInfo extends Component {
  state = {}

  componentDidMount () {
    const url = '/pt/my-tutee.php';
    const payload = {
      rsId: this.props.rsId,
      jwt: this.props.token
    };
    axios.post(url, payload)
      .then(res => {
        if (res.data.success === 1) {
          const rsInfo = res.data.rsInfo;
          const typeInfo = res.data.typeInfo;
          rsInfo['bookedType'] = this.props.language === 'de' ? typeInfo.name_de : typeInfo.name_en;
          this.setState(rsInfo);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  render () {
    const displayedInfo = [];
    config.registration_form.forEach(entry => {
      if (this.state[entry.db_name]) {
        displayedInfo.push(
          <li key={entry.db_name}>
            <strong>{entry.label[this.props.language]}:</strong> {this.state[entry.db_name]}
          </li>
        );
      }
    });

    displayedInfo.splice(3, 0,
      <li key='type'><strong>{langStrings[this.props.language].consultation_type}:</strong> {this.state.bookedType}</li>,
      <li key='format'><strong>Format:</strong> {langStrings[this.props.language][this.state.bookedFormat]}</li>
    );

    return (
      <div>
      <h2>Informationen zu Ratsuchenden</h2>
      <ul>
        {displayedInfo}
      </ul>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token,
    role: state.pt.role,
    language: state.rs.language
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RSInfo);
