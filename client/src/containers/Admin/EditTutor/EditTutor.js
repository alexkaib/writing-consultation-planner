import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import EditTutorForm from '../../../components/Admin/EditTutorForm/EditTutorForm';


class EditTutor extends Component {
  constructor (props) {
    super(props);

    this.state = {
      tutorInfo: this.props.tutorInfo,
      loading: false,
      error: null
    }
  }


  inputHandler = event => {
    const currentInfo = {...this.state.tutorInfo};
    currentInfo[event.target.id] = event.target.value;
    this.setState({tutorInfo: currentInfo});
  }

  deleteHandler = () => {
    const payload = {
      jwt: this.props.token,
      tutorId: parseInt(this.state.tutorInfo.ptId)
    }
    axios.post('/admin/delete-tutor.php', payload)
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

  submissionHandler = e => {
    e.preventDefault();

    const url = '/admin/update-tutor.php';

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

  componentDidMount () {
  }

  render() {
    return (
      <>
      <EditTutorForm
        language={this.props.language}
        inputHandler={this.inputHandler}
        submissionHandler={this.submissionHandler}
        deleteHandler={this.deleteHandler}
        tutorInfo={this.state.tutorInfo} />
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.pt.token,
    language: state.rs.language,
    tutorInfo: state.admin.selectedTutorInfo
  };
};

export default withRouter(connect(mapStateToProps)(EditTutor));
