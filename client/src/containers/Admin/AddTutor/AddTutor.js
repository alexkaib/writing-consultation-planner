import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import langStrings from '../../../lang/languageStrings.json';

import NewTutorForm from '../../../components/Admin/AddTutorForm/NewTutorForm';

class AddTutor extends Component {
  state = {
    tutorInfo: {
      role: 'peerTutor'
    },
    loading: false,
    success: false,
    error: null
  }

  inputHandler = event => {
    const currentInfo = {...this.state.tutorInfo};
    currentInfo[event.target.id] = event.target.value;
    this.setState({tutorInfo: currentInfo});
  }

  submissionHandler = e => {
    e.preventDefault();

    if ( !this.state.tutorInfo.password || this.state.tutorInfo.password.length < 8) {
      this.setState({error: langStrings[this.props.language].password_length});
      return null;
    }

    const url = '/admin/create-tutor.php';

    const payload = {
      jwt: this.props.token,
      tutorInfo: this.state.tutorInfo
    }

    axios.post(url, payload)
      .then(res => {
        if (res.data.success === 1) {
          // go back to tutor management
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0;
          this.props.history.push('/pt/pt-management');
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

  render() {
    return (
        <>
        <NewTutorForm
          language={this.props.language}
          inputHandler={this.inputHandler}
          submissionHandler={this.submissionHandler}
          tutorInfo={this.state.tutorInfo} />
          {this.state.error ? <p>{langStrings[this.props.language].error + ': ' + this.state.error}</p> : null}
        </>
    )
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

export default withRouter(connect(mapStateToProps)(AddTutor));
