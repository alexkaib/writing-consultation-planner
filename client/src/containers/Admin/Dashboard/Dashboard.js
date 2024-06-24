import React, { Component } from 'react';
import axios from '../../../axios-dates/axios-dates';
import { connect } from 'react-redux';

import DashboardDisplay from '../../../components/Admin/Dashboard/DashboardDisplay';
import DashboardAlert from '../../../components/Admin/Dashboard/DashboardAlert';
import Spinner from '../../../components/UI/Spinner/Spinner';


class Dashboard extends Component {
  state = {
    stats: {
        openSlotsFuture: 0,
        openSlotsRecent: 0,
        openSlotsPast: 0,
        totalBookingsFuture: 0,
        totalBookingsRecent: 0,
        totalBookingsPast: 0,
        firstBookingsFuture: 0,
        firstBookingsRecent: 0,
        firstBookingsPast: 0,
        followUpsFuture: 0,
        followUpsRecent: 0,
        followUpsPast: 0,
        guestRequestsFuture: 0,
        guestRequestsRecent: 0,
        guestRequestsPast: 0,
        protocols: 0,
        missingProtocols: 0,
        noShows: 0,
        evaluationsSent: 0
    },
    consultationTypes: [],
    showFewOpenSlotsAlert: false,
    showMissingProtocols: false,
    showPercentages: false,
    error: null,
    loading: true
  }

  onTypeSelect = e => {
    e.preventDefault();
    let button = e.target.closest('button');
    this.loadStats(button.id);
  }

  alertCloseHandler = e => {
    e.target.parentElement.style.display='none';
  }

  togglePercentages = () => {
    this.setState({showPercentages: !this.state.showPercentages});
  }

  loadStats = (selectedTypeId) => {
    const url = '/admin/dashboard-stats.php';
    // send both the analogue and digital id of the selected consultation type
    const payload = {
      jwt: this.props.token,
      typeId: selectedTypeId,
    }
    axios.post(url, payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({
            stats: res.data.stats,
            consultationTypes: res.data.types,
            loading: false
          });
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
    this.loadStats(null);
  }

  render () {
    const alertsToShow = (
      <>
      { this.state.error ?
        <DashboardAlert onCloseAlert={this.alertCloseHandler}>
          Beim Laden der Daten für das Dashboard ist ein Server-Fehler aufgetreten: {this.state.error}
        </DashboardAlert>
        : null }

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
        {this.state.loading ? <Spinner /> :
          <>
            {alertsToShow}
            <DashboardDisplay
              stats={this.state.stats}
              consultationTypes={this.state.consultationTypes}
              onTypeSelect={this.onTypeSelect}
              showPercentages={this.state.showPercentages}
              togglePercentages={this.togglePercentages}
              language={this.props.language} />
          </>
        }
      </>
    );
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

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
