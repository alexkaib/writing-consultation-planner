import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import ConsultationTypes from '../../../components/RS/ConsultationTypes/ConsultationTypes';


class TypeSelector extends Component {

  typeSelectionHandler = (consultationType) => {
    this.props.onTypeSelect(consultationType);
    // for institutions not using the calendar, forward directly to contact form
    if (consultationType === 'isz') {
      this.props.history.push({pathname: '/rs/isz-submit/'});
    } else {
      this.props.history.push({pathname: '/rs/select-slot/'});
    }
  };

  render () {
    // adding new consultation types requires updates to database and the following files:
    // containers/PT/ConsultationTypeSelection.js
    // components/UI/FormSelector.js
    // containers/PT/RSInfo.js
    let studentConsultationTypes = [
      {type: 'student', text: 'Schreibberatung (Deutsch)', logo: 'sz'},
      {type: 'student_english', text: 'Schreibberatung (Englisch)', logo: 'sz'},
      {type: 'student_reading', text: 'Leseberatung (Deutsch)', logo: 'sz'},
    ];

    let phdConsultationTypes = [
      {type: 'phd', text: 'Schreibberatung (Deutsch)', logo: 'sz'},
      {type: 'phd_english', text: 'Schreibberatung (Englisch)', logo: 'sz'},
    ];

    if (this.props.english) {
      studentConsultationTypes = [
        {type: 'student_english', text: 'Writing Consultation in English', logo: 'sz'},
        {type: 'student', text: 'Writing Consultation (German)', logo: 'sz'},
        {type: 'student_reading', text: 'Reading consultation (German)', logo: 'sz'},
      ];

      phdConsultationTypes = [
        {type: 'phd', text: 'Writing Consultation (German)', logo: 'sz'},
        {type: 'phd_english', text: 'Writing Consultation (English)', logo: 'sz'}
      ];
    }

    return (
      <ConsultationTypes
        onTypeSelect={this.typeSelectionHandler}
        studentConsultationTypes={studentConsultationTypes}
        phdConsultationTypes={phdConsultationTypes}
        english={this.props.english} />
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
    english: state.rs.english
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TypeSelector));
