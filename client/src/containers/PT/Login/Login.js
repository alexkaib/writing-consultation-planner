import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';
import { withRouter } from "react-router-dom";

import LoginForm from '../../../components/PT/Login/LoginForm';
import Spinner from '../../../components/UI/Spinner/Spinner';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errorMessage: null
  }

  inputHandler = (event) => {
    const currentState = {...this.state};
    currentState[event.target.id] = event.target.value;
    this.setState(currentState);
  }

  submitLoginHandler = e => {
    e.preventDefault();
    this.props.onSubmitLogin(this.state.email, this.state.password);
    const authData = {
      username: this.state.email,
      password: this.state.password
    };
    axios.post('/auth.php', authData)
      .then(res => {
        console.log(res);
        if (res.data.success === 1) {
          const token = res.data.access_token;
          this.props.onAuthSuccess(token);
          this.props.history.push('/pt/landing');
        } else {
          this.props.onAuthFail(res.data.msg);
          this.setState({errorMessage: res.data.msg});
        }
      })
      .catch(err => {
        console.log(err);
        this.props.onAuthFail(err);
        this.setState({errorMessage: err, password: ''});
      })
  }

  render () {
    let toDisplay = (
      <LoginForm
        email={this.state.email}
        password={this.state.password}
        inputHandler={this.inputHandler}
        submitLoginHandler={this.submitLoginHandler}
        errorMessage={this.state.errorMessage}
        available={this.state.password.length > 5 && this.state.email.includes('@')}/>
    );
    if (this.props.loading) {toDisplay = <Spinner />};
    return toDisplay;
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSubmitLogin: (email, password) => dispatch({type: 'SUBMIT_LOGIN', email: email, password: password}),
    onAuthSuccess: (token) => dispatch({type: 'AUTH_SUCCESS', token: token}),
    onAuthFail: (error) => dispatch({type: 'AUTH_FAIL', error: error})
  }
};

const mapStateToProps = (state) => {
  return {
    loading: state.pt.authLoading
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
