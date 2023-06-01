import React, { Component } from 'react';
import { connect } from 'react-redux';

import LogoutComp from '../../../components/PT/Logout/Logout';

class Logout extends Component {
  render() {
    let toDisplay = <LogoutComp
      name={this.props.name}
      onLogoutButton={this.props.onLogOut} />
    if (!this.props.loggedIn) {
      toDisplay = <h3>Du wurdest erfolgreich abgemeldet.</h3>
    }
    return toDisplay;
  }
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    name: state.pt.firstName
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogOut: () => dispatch({type: 'LOG_OUT'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
