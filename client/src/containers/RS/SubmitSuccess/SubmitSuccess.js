import React, { Component } from 'react';
import { connect } from 'react-redux';

import config from '../../../config.json';
import langStrings from '../../../lang/languageStrings.json';

class SubmitSuccess extends Component {
  render(){
    return(
      <div>
        <h1>{langStrings[this.props.language].appointment_confirmed}</h1>
        <p>{langStrings[this.props.language].appointment_confirmed_desc}</p>
        <p>{langStrings[this.props.language]['no_mail_contingency'].replace("{{institutionMail}}", config.email)}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    english: state.rs.english,
    language: state.rs.language
  };
};

export default connect(mapStateToProps)(SubmitSuccess);
