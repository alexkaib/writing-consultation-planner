import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import EditConsultationTypeForm from '../../../components/Admin/EditConsultationTypeForm/EditConsultationTypeForm';
import Spinner from '../../../components/UI/Spinner/Spinner';

class EditConsultationType extends Component {
  state = {
    typeInfo: {},
    loading: true,
    error: null
  }

  inputHandler = event => {
    const currentInfo = {...this.state.typeInfo};
    currentInfo[event.target.id] = event.target.value;
    this.setState({typeInfo: currentInfo});
  }

  deleteHandler = () => {
    const payload = {
      jwt: this.props.token,
      typeId: this.props.typeId
    }
    axios.post('/admin/delete-type.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          // go back to type management
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

  submissionHandler = e => {
    e.preventDefault();
    const url = '/admin/update-type.php';

    const payload = {
      jwt: this.props.token,
      typeId: this.props.typeId,
      typeInfo: this.state.typeInfo
    }
    axios.post(url, payload)
      .then(res => {
        if (res.data.success === 1) {
          // go back to type management
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

  componentDidMount () {
    const payload = {
      jwt: this.props.token,
      typeId: this.props.typeId
    }

    axios.post('/admin/get-type.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({typeInfo: res.data.typeInfo, loading: false});
        } else {
          if (res.data.msg) {
            this.setState({error: res.data.msg, loading: false});
          } else {
            this.setState({error: res.data, loading: false});
          }
        }
      })
      .catch(err => {
        this.setState({error: err.message, loading: false});
      })
  }

  render() {
    return (
      <>
      {this.state.loading ? <Spinner /> :
        (this.state.error ? <p>{this.state.error}</p> :
          <EditConsultationTypeForm
            language={this.props.language}
            inputHandler={this.inputHandler}
            submissionHandler={this.submissionHandler}
            deleteHandler={this.deleteHandler}
            typeInfo={this.state.typeInfo} />)}
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.pt.token,
    language: state.rs.language,
    typeId: state.admin.selectedTypeId
  };
};

export default withRouter(connect(mapStateToProps)(EditConsultationType));
