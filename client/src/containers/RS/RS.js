import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import TypeSelector from './TypeSelector/TypeSelector';
import SlotSelector from './SlotSelector/SlotSelectorB';
import SlotSubmitter from './SlotSubmitter/SlotSubmitter';
import SubmitSuccess from './SubmitSuccess/SubmitSuccess';

const rs = (props) => {
  return (
    <Switch>
      <Route exact path='/'>
        <TypeSelector />
      </Route>
      <Route path='/rs/select-type'>
        <TypeSelector />
      </Route>
      <Route path='/rs/select-slot'>
        {props.selectedType ? <SlotSelector /> : <Redirect to="/" />}
      </Route>
      <Route path='/rs/submit-slot'>
        {props.selectedSlotId ? <SlotSubmitter /> : <Redirect to="/" />}
      </Route>
      <Route path='/rs/success'>
        <SubmitSuccess />
      </Route>
    </Switch>
  );
};

const mapStateToProps = (state) => {
  return {
    selectedType: state.rs.consultationType,
    selectedSlotId: state.rs.selectedSlotId
  };
};

export default connect(mapStateToProps)(rs);
