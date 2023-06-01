import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../axios-dates/axios-dates';

import Landing from '../../components/PT/Landing/Landing';
import Dashboard from '../Admin/Dashboard/Dashboard';

class LandingPT extends Component {
  state = {
    userLoaded: false
  }

  navButtonHandler = (location) => {
    const url = '/pt/' + location;
    this.props.history.push(url);
    return null;
  }

  componentDidMount() {
    const auth = {
      jwt: this.props.token
    }
    axios.post('/pt/tutor.php', auth)
      .then(res => {
        this.props.onLoadedUser(
          res.data.logged_in_tutor_id,
          res.data.logged_in_tutor_name,
          res.data.logged_in_tutor_role
        );
      })
      .catch(err => {
        console.log(err)
      })
  }

  render () {
    let toDisplay = <h3>Bitte melde dich an, um auf diese Seite zuzugreifen.</h3>

    if (this.props.loggedIn) {
      //the default locations needed for basic functionality
      const locations = [
        {
          location: 'my-slots',
          deText: 'Überprüfe und lösche einzelne Termine',
          deButton: 'Beratungskalender'
        },
        {
          location: 'set-slot',
          deText: 'Bearbeite deine regulären Beratungszeiten',
          deButton: 'Beratungszeiten'
        },
        {
          location: 'registrations',
          deText: 'Verwalte aktuelle Termine',
          deButton: 'Anmeldungen'
        },

      ];

      // additional locations for peer tutors
      if (this.props.role === 'peertutor' || this.props.role === 'admin') {
        locations.push(
          {
            location: 'archive',
            deText: 'Durchsuche alte Protokolle und teile sie mit Kolleg*innen',
            deButton: 'Archiv'
          },
          {
            location: 'team-calendar',
            deText: 'Zeige aktuelle Termine deiner Kolleg*innen an und melde dich für Hospitationen',
            deButton: 'Teamkalender'
          },
          {
            location: 'stats',
            deText: 'Verfolge die Entwicklung des Schreibzentrums in Zahlen',
            deButton: 'Statistiken'
          },
          {
            location: 'logout',
            deText: 'Melde dich ab',
            deButton: 'Logout'
          }
        );
      }

      toDisplay = (
        <div>
          {this.props.role === 'admin' ? <Dashboard /> : null}
          <Landing
            name={this.props.firstName}
            locations={locations}
            navButtonHandler={this.navButtonHandler}/>
        </div>
      )


    }
    return toDisplay;
  }
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    token: state.pt.token,
    ptId: state.pt.ptId,
    firstName: state.pt.firstName,
    role: state.pt.role
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadedUser: (ptId, firstName, role) => dispatch(
      {type: 'LOADED_USER', ptId: ptId, firstName: firstName, role: role}
    )
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandingPT));
