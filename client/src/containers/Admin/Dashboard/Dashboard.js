import React, { Component } from 'react';
//import axios from '../../../axios-dates/axios-dates';
import { connect } from 'react-redux';

import DashboardDisplay from '../../../components/Admin/Dashboard/DashboardDisplay';
import DashboardAlert from '../../../components/Admin/Dashboard/DashboardAlert';

class Dashboard extends Component {
  state = {
    stats: {},
    showFewOpenSlotsAlert: true,
    showMissingProtocols: true,
    showPercentages: false,
  }

  alertCloseHandler = e => {
    e.target.parentElement.style.display='none';
  }

  togglePercentages = () => {
    this.setState({showPercentages: !this.state.showPercentages});
  }

  render () {
    const alertsToShow = (
      <>
      { this.state.showFewOpenSlotsAlert ?
        <DashboardAlert onCloseAlert={this.alertCloseHandler}>
          In den nächsten 30 Tagen sind nur wenige offene Termine verfügbar.
        </DashboardAlert>
        : null }

      { this.state.showMissingProtocols ?
        <DashboardAlert onCloseAlert={this.alertCloseHandler}>
          Aus den letzten sechs Monaten fehlen über 20 Protokolle.
        </DashboardAlert>
        : null }

      </>
    );

    return (
      <>
        <h1>Dashboard</h1>
        {alertsToShow}
        <DashboardDisplay
          showPercentages={this.state.showPercentages}
          togglePercentages={this.togglePercentages} />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token,
    english: state.rs.english
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
