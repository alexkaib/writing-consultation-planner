import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import PTManagement from '../../../components/Admin/PTAdmin/PTManagement';
import Spinner from '../../../components/UI/Spinner/Spinner';

class PTAdmin extends Component {
  state = {
    loading: true,
    tutors: [],
    stats: {},
    error: null
  }

  addTutorHandler = () => {
    // open new page with blank tutor form
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    this.props.history.push('/pt/add-tutor');
    return null;
  }

  editTutorHandler = (tutorInfo) => {
    // store selected tutor id
    this.props.onEditTutor(tutorInfo);
    // open new page with tutor form filled with current info
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    this.props.history.push('/pt/edit-tutor');
    return null;
  }

  loadTutors = () => {
    const url = '/admin/get-tutors.php';

    const auth = {
      jwt: this.props.token
    }

    axios.post(url, auth)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({tutors: res.data.tutors});
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

  loadStats = () => {
    const url = '/pt/XXX.php';
    const auth = {
      jwt: this.props.token
    }
    //gets individual stats for each tutor
    axios.post(url, auth)
      .then(res => {
        if (res.data.success === 1) {
          const newStats = res.data.stats;
          this.setState({stats: newStats, loading: false});
        } else {
          this.setState({loading: false, error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({loading: false, error: err.message});
      })
  }

  componentDidMount () {
    this.loadTutors();
    this.setState({loading: false});
  }

  render () {
    return (
      <>
        <h1 style={{textAlign: 'center'}}>PT-Verwaltung</h1>
        {this.state.loading ?
          <Spinner /> :
          <PTManagement
            tutors={this.state.tutors}
            language={this.props.language}
            addTutorHandler={this.addTutorHandler}
            editTutorHandler={this.editTutorHandler}
          />
        }
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onEditTutor: (tutorInfo) => dispatch({type: 'EDIT_TUTOR', tutorInfo: tutorInfo})
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PTAdmin));
