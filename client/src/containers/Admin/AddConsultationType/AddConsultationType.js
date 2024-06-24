import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import config from '../../../config.json';

import AddConsultationTypeForm from '../../../components/Admin/AddConsultationTypeForm/AddConsultationTypeForm';
import Spinner from '../../../components/UI/Spinner/Spinner';

class AddConsultationType extends Component {
  state = {
    // need default values for displaying
    typeInfo: {
      name_de: '',
      name_en: '',
      audience: config.audiences[0],
      info_de: '',
      info_en: '',
      min_date: 2,
      max_date: 21,
      send_cal_invite: true,
      confirmation_mail: '',
      eval_mail: ''
    },
    loading: false,
    success: false,
    error: null
  }

  inputHandler = event => {
    const currentInfo = {...this.state.typeInfo};
    currentInfo[event.target.id] = event.target.value;
    this.setState({typeInfo: currentInfo});
  }

  submissionHandler = e => {
    e.preventDefault();

    const url = '/admin/create-type.php';

    const payload = {
      jwt: this.props.token,
      typeInfo: this.state.typeInfo
    }

    axios.post(url, payload)
      .then(res => {
        if (res.data.success === 1) {
          // go back to consultation types
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0;
          this.props.history.push('/pt/consultation-config');
          return null;
        } else {
          if (res.data.msg) {
            this.setState({error: res.data.msg});
          } else {
            this.setState({error: res.data});
          }
        }
      })
      .catch(err => {
        this.setState({error: err.message});
      })
  }

  componentDidMount () {}

  render() {
    return (
        <>
        {this.state.loading ? <Spinner /> :
          (this.state.error ? <p>{this.state.error}</p> :
            <AddConsultationTypeForm
              typeInfo={this.state.typeInfo}
              language={this.props.language}
              inputHandler={this.inputHandler}
              submissionHandler={this.submissionHandler}/>)
        }
        </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    token: state.pt.token,
    language: state.rs.language
  };
};

export default withRouter(connect(mapStateToProps)(AddConsultationType));
