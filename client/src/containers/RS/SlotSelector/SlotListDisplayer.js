import React, { Component } from 'react';

import AuxComp from '../../../hoc/AuxComp/AuxComp';
import SlotList from '../../../components/RS/SlotList/SlotList';

class SlotListDisplayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      availableSlots: ["a", "b", "c", "d"]
    };
  }


  render() {
    return (
      <AuxComp>
        <h2>Listenansicht</h2>
        <SlotList availableSlots={this.state.availableSlots} />
      </AuxComp>
    );
  }
};

export default SlotListDisplayer;
