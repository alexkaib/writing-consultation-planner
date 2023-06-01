import React, {Component} from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Login from './Login/Login';
import LandingPT from '../Landing/LandingPT';
import SlotSetter from './SlotSetter/SlotSetter';
import Calendar from './Calendar/Calendar';
import Registrations from './Registrations/Registrations';
import Protocol from './Protocol/Protocol';
import Archive from './Archive/Archive';
import TeamCalendar from './TeamCalendar/TeamCalendar';
import Logout from './Logout/Logout';
import StatsDisplayer from './Stats/StatsDisplayer';

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
        <Route path='/pt/set-slot'>
          {this.props.loggedIn ? <SlotSetter /> : <Redirect to="/pt"/>}
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
          <Logout />
        </Route>
        <Route path='/pt/stats'>
          <StatsDisplayer />
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
