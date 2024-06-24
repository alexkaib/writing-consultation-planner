import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import Options from '../../../components/PT/Calendar/Options';
import Modal from '../../../components/UI/Modal/Modal';
import Spinner from '../../../components/UI/Spinner/Spinner';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

class CalendarOptions extends Component {
  state = {
    modalContent: null,
    showModal: false,
    showExplanation: false,
    cancelAppointments: false,
    numberOfDays: 2
  }

  toggleExplanation = () => {
    this.setState({showExplanation: !this.state.showExplanation});
  }

  toggleCancelAppointments = () => {
    this.setState({cancelAppointments: !this.state.cancelAppointments});
  }

  daySelectHandler = (event) => {
    this.setState({numberOfDays: event.target.value});
  }

  submitCancelRequest = () => {
    this.setState({showModal: true, modalContent: <Spinner />});

    const payload = {
      cancelAppointments: this.state.cancelAppointments,
      numberOfDays: this.state.numberOfDays
    };

    payload["jwt"] = this.props.token;
    axios.post('/pt/delete-slots.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({
            modalContent: 'Alle Beratungen im ausgewählten Zeitraum wurde abgesagt.',
            showModal: true
          });
        } else {
          this.setState({
            modalContent: 'Es ist ein Fehler aufgetreten: ' + res.data.msg,
            showModal: true
          });
        }
      })
      .catch(err => {
        this.setState({modalContent: 'Es ist ein Fehler aufgetreten: ' + err.message});
      })
  }

  backdropClickHandler = () =>{
    this.setState({showModal: false, modalContent: null});
  }

  render () {
    return (
      <AuxComp>
      <Modal visible={this.state.showModal} onBackdropClick={this.backdropClickHandler}>
        {this.state.modalContent}
      </Modal>
      <Options
        showExplanation={this.state.showExplanation}
        toggleExplanation={this.toggleExplanation}
        calendarView={this.props.calendarView}
        toggleViewHandler={this.props.toggleViewHandler}
        toggleCancelAppointments={this.toggleCancelAppointments}
        cancelAppointments={this.state.cancelAppointments}
        daySelectHandler={this.daySelectHandler}
        submitCancelRequest={this.submitCancelRequest} />
      </AuxComp>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.pt.token
  };
};

export default connect(mapStateToProps)(CalendarOptions);
