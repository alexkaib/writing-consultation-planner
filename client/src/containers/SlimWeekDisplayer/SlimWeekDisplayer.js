import React, { Component } from 'react';

import Days from '../../components/SlimWeek/Days/Days';
import WeekButtons from '../../components/SlimWeek/WeekButtons/WeekButtons';

class SlimWeekDisplayer extends Component {

  state = {
    displayedDays: [],
    expandedDays: [],
    displayedDaysIndex: 0
  }

  dayClickedHandler = date => {
    let currentlyExpanded = [...this.state.expandedDays]
    // toggles date's presence in the expanded days array
    const i = currentlyExpanded.indexOf(date);
    if (i >= 0) {
      currentlyExpanded.splice(i, 1);
    } else {
      currentlyExpanded.push(date);
    }

    this.setState({expandedDays: currentlyExpanded});
  }

  nextWeekHandler = () => {
    const nextWeekIndex = this.state.displayedDaysIndex + 5;
    if (this.props.days.length >= nextWeekIndex + 5) {
      this.setState({
        displayedDays: this.props.days.slice(nextWeekIndex, nextWeekIndex + 5),
        displayedDaysIndex: nextWeekIndex
      });
    }
  }

  prevWeekHandler = () => {
    const prevWeekIndex = this.state.displayedDaysIndex - 5;
    if (prevWeekIndex >= 0) {
      this.setState({
        displayedDays: this.props.days.slice(prevWeekIndex, prevWeekIndex + 5),
        displayedDaysIndex: prevWeekIndex
      });
    }
  }

  componentDidMount() {
    this.setState({
      displayedDays: this.props.days.slice(0,5)
    })
  }

  render() {
    return (
      <div>
        <Days
          days={this.state.displayedDays}
          addNewSlotHandler={this.props.addNewSlotHandler}
          expandedDays={this.state.expandedDays}
          slots={this.props.slots}
          onDayClick={this.dayClickedHandler}
          onSlotClick={this.props.slotSelectionHandler}
          language={this.props.language} />
        <WeekButtons
          nextAvailable={this.state.displayedDaysIndex < this.props.days.length - 5}
          prevAvailable={this.state.displayedDaysIndex >= 5}
          onNextClick={this.nextWeekHandler}
          onPrevClick={this.prevWeekHandler}
          language={this.props.language}/>
      </div>
    );
  }
};

export default SlimWeekDisplayer;
