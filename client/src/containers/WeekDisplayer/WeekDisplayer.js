import React, { Component } from 'react';

import WeekButtons from '../../components/Week/WeekButtons/WeekButtons';
import DayButtons from '../../components/Week/DayButtons/DayButtons';
import Days from '../../components/Week/Days/Days';

class WeekDisplayer extends Component {
  constructor(props) {
    super(props);
    //change this to a passed parameter so PTs can access dates further in advance
    const nextThreeWeeks = [];
    let today = new Date();
    const currentWeekday = today.getUTCDay();
    today.setDate(today.getDate() + (1 - currentWeekday)); //set 'today' to current week's monday
    for (let i = 0; i < this.props.numberOfWeeks; i++) {
      for (let j = 0; j < 5; j++) {
        nextThreeWeeks.push(today.toISOString().split('T')[0]);
        today.setDate(today.getDate() + 1);
      };
      today.setDate(today.getDate() + 2);
    };

    this.state = {
      allDates: nextThreeWeeks,
      dates: nextThreeWeeks.slice(0,5),
      slots: [],
      nextAvailable: true,
      prevAvailable: false
    };
  }

  nextWeekHandler = () => {
    var currentIdx = this.state.allDates.indexOf(this.state.dates[4]);

    if (this.state.allDates.length - (currentIdx + 1) < 5) {
      this.setState({nextAvailable: false});
    } else {
      var newDates = this.state.allDates.slice(currentIdx + 1, currentIdx + 6);
      if (this.state.allDates.length - (this.state.allDates.indexOf(newDates[4]) + 1) < 5) {
        this.setState({nextAvailable: false})
      }
      this.setState({dates: newDates, prevAvailable: true});
    }
  };

  prevWeekHandler = () => {
    var currentIdx = this.state.allDates.indexOf(this.state.dates[0]);

    if (currentIdx < 4) {
      this.setState({prevAvailable: false});
    } else {
      var newDates = this.state.allDates.slice(currentIdx - 5, currentIdx);
      if (this.state.allDates.indexOf(newDates[0]) < 4) {
        this.setState({prevAvailable: false})
      }
      this.setState({dates: newDates, nextAvailable: true});
    }
  }

  render() {
    return (
      <div>
        <DayButtons dates={this.state.dates} />
        <Days
          dates={this.state.dates}
          onSlotClick={this.props.slotSelectionHandler}
          availableSlots={this.props.slots}
          disableEmptySlots={this.props.disableEmptySlots} />
        <WeekButtons
          onNextClick={this.nextWeekHandler}
          onPrevClick={this.prevWeekHandler}
          nextAvailable={this.state.nextAvailable}
          prevAvailable={this.state.prevAvailable}
          />
      </div>
    );
  }
};

export default WeekDisplayer;
