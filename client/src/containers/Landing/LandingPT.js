import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../axios-dates/axios-dates';

import Landing from '../../components/PT/Landing/Landing';
import Dashboard from '../Admin/Dashboard/Dashboard';
import langStrings from '../../lang/languageStrings.json';

class LandingPT extends Component {
  state = {
    userLoaded: false
  }

  navButtonHandler = (location) => {
    const url = '/pt/' + location;
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
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
          buttonDescription: langStrings[this.props.language]['nav_calendar_desc'],
          buttonLable: langStrings[this.props.language]['nav_calendar']
        },
        /*
        {
          location: 'set-slot',
          buttonDescription: langStrings[this.props.language]['nav_schedule_desc'],
          buttonLable: langStrings[this.props.language]['nav_schedule']
        },
        */
        {
          location: 'registrations',
          buttonDescription: langStrings[this.props.language]['nav_registrations_desc'],
          buttonLable: langStrings[this.props.language]['nav_registrations']
        },

      ];

      // additional locations for peer tutors
      if (this.props.role === 'peerTutor' || this.props.role === 'admin') {
        locations.push(
          {
            location: 'archive',
            buttonDescription: langStrings[this.props.language]['nav_archive_desc'],
            buttonLable: langStrings[this.props.language]['nav_archive']
          },
          {
            location: 'team-calendar',
            buttonDescription: langStrings[this.props.language]['nav_teamcal_desc'],
            buttonLable: langStrings[this.props.language]['nav_teamcal']
          },
          /*
          {
            location: 'stats',
            buttonDescription: langStrings[this.props.language]['nav_statistics_desc'],
            buttonLable: langStrings[this.props.language]['nav_statistics']
          },
          */
          {
            location: 'logout',
            buttonDescription: langStrings[this.props.language]['nav_logout_desc'],
            buttonLable: langStrings[this.props.language]['nav_logout']
          }
        );
      }
/*
      if (this.props.role === 'admin') {
        locations.unshift(
          {
            location: 'pt-management',
            buttonDescription: langStrings[this.props.language]['nav_pt_management_desc'],
            buttonLable: langStrings[this.props.language]['nav_pt_management']
          },
          {
            location: 'consultation-config',
            buttonDescription: langStrings[this.props.language]['nav_consultation_config_desc'],
            buttonLable: langStrings[this.props.language]['nav_consultation_config']
          }
        );
      }
      */
      const adminLocations = [
        {
          location: 'pt-management',
          buttonDescription: langStrings[this.props.language]['nav_pt_management_desc'],
          buttonLable: langStrings[this.props.language]['nav_pt_management']
        },
        {
          location: 'consultation-config',
          buttonDescription: langStrings[this.props.language]['nav_consultation_config_desc'],
          buttonLable: langStrings[this.props.language]['nav_consultation_config']
        },
        {
          location: 'stats',
          buttonDescription: langStrings[this.props.language]['nav_statistics_desc'],
          buttonLable: langStrings[this.props.language]['nav_statistics']
        }
        /*
        {
          location: 'alt-calendar-preview',
          buttonDescription: "Testansicht der neuen Terminansicht",
          buttonLable: "Kalender Preview"
        },
        {
          location: 'form-builder-preview',
          buttonDescription: "Formular Test",
          buttonLable: "Formular Test"
        }
        */
      ]

      toDisplay = (
        <div>
          {this.props.role === 'admin' ?
            <>
            <Dashboard />
            <Landing
              greeting="Verwaltung"
              locations={adminLocations}
              navButtonHandler={this.navButtonHandler}/>
            </> : null
          }
          <Landing
            greeting={
              langStrings[this.props.language]['pt_greeting']
              .replace("{{tutorName}}", this.props.firstName)
            }
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
    role: state.pt.role,
    language: state.rs.language
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
