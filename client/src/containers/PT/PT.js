import React, {Component} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from './Login/Login';
import LandingPT from '../Landing/LandingPT';
import Calendar from './Calendar/Calendar';
import Registrations from './Registrations/Registrations';
import Protocol from './Protocol/Protocol';
import Archive from './Archive/Archive';
import TeamCalendar from './TeamCalendar/TeamCalendar';
import Logout from './Logout/Logout';
import StatsDisplayer from './Stats/StatsDisplayer';
import PTAdmin from '../Admin/PTAdmin/PTAdmin';
import AddTutor from '../Admin/AddTutor/AddTutor';
import EditTutor from '../Admin/EditTutor/EditTutor';
import ConsultationConfig from '../Admin/ConsultationConfig/ConsultationConfig';
import AddConsultationType from '../Admin/AddConsultationType/AddConsultationType';
import EditConsultationType from '../Admin/EditConsultationType/EditConsultationType';


class PT extends Component {
  render () {
    return (
      <Switch>
        <Route path='/pt' exact>
          <Login />
        </Route>
        <Route path='/pt/landing'>
          {this.props.loggedIn ? <LandingPT /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/my-slots'>
          {this.props.loggedIn ? <Calendar /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/registrations'>
          {this.props.loggedIn ? <Registrations /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/protocol'>
          {this.props.loggedIn ? <Protocol /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/archive'>
          {this.props.loggedIn ? <Archive /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/team-calendar'>
          {this.props.loggedIn ? <TeamCalendar /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/logout'>
          {this.props.loggedIn ? <Logout /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/stats'>
          {this.props.loggedIn ? <StatsDisplayer /> : <Redirect to="/pt"/>}
        </Route>
        {
          // additional locations for admins
        }
        <Route path='/pt/pt-management'>
          {this.props.loggedIn ? <PTAdmin /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/add-tutor'>
          {this.props.loggedIn ? <AddTutor /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/edit-tutor'>
          {this.props.loggedIn ? <EditTutor /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/consultation-config'>
          {this.props.loggedIn ? <ConsultationConfig /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/add-consultation-type'>
          {this.props.loggedIn ? <AddConsultationType /> : <Redirect to="/pt"/>}
        </Route>
        <Route path='/pt/edit-consultation-type'>
          {this.props.loggedIn ? <EditConsultationType /> : <Redirect to="/pt"/>}
        </Route>
      </Switch>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn
  };
};

export default connect(mapStateToProps)(PT);
