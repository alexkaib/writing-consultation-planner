import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Landing from '../Landing/Landing';
import TypeSelector from './TypeSelector/TypeSelector';
import SlotSelector from './SlotSelector/SlotSelectorB';
import SlotSubmitter from './SlotSubmitter/SlotSubmitter';
import SubmitSuccess from './SubmitSuccess/SubmitSuccess';

const rs = (props) => {
  return (
    <Switch>
      <Route exact path='/'>
        <Landing />
      </Route>
      <Route path='/rs/select-type'>
        {props.termsAccepted ? <TypeSelector /> : <Redirect to="/" />}
      </Route>
      <Route path='/rs/select-slot'>
        {props.termsAccepted ? <SlotSelector /> : <Redirect to="/" />}
      </Route>
      <Route path='/rs/submit-slot'>
        {props.termsAccepted ? <SlotSubmitter /> : <Redirect to="/" />}
      </Route>
      <Route path='/rs/success'>
        <SubmitSuccess />
      </Route>
    </Switch>
  );
};

const mapStateToProps = (state) => {
  return {
    termsAccepted: state.rs.termsAccepted
  };
};

export default connect(mapStateToProps)(rs);
