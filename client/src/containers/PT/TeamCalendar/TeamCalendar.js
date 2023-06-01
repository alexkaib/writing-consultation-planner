import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import TeamSlots from '../../../components/PT/TeamSlots/TeamSlots';
import Modal from '../../../components/UI/Modal/Modal';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Button from '../../../components/UI/Button/Button';

import AuxComp from '../../../hoc/AuxComp/AuxComp';

class TeamCalendar extends Component {
  state = {
    loading: true,
    appointments: [],
    selectedId: null,
    modalContent: null,
    error: null
  }

  appointmentClickHandler = (terminId) => {
    console.log(terminId)
    this.setState({modalContent: 'beforeSubmit', selectedId: terminId});
  }

  submitRequestHandler = () => {
    const url = '/pt/send-guest-request.php';
    const payload = {
      jwt: this.props.token,
      terminId: this.state.selectedId
    };
    //gets future appointments that someone registered for
    axios.post(url, payload)
      .then(res => {
        if (res.data.success === 1) {
          console.log(res);
          this.setState({modalContent: 'success'});
        } else {
          this.setState({loading: false, modalContent: 'error', error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({loading: false, modalContent: 'error', error: err.message});
      })
  }

  backdropClickHandler = () => {
    this.setState({modalContent: null, selectedId: null, loading: true});
    this.loadAppointments();
  }

  loadAppointments = () => {
    const url = '/pt/team-appointments.php';
    const auth = {
      jwt: this.props.token
    }
    //gets future appointments that someone registered for
    axios.post(url, auth)
      .then(res => {
        if (res.data.success === 1) {
          const newSlots = res.data.slots.map(slot => ({
            terminId: slot.terminId,
            tutor: slot.firstName + ' ' + slot.lastName,
            date: slot.datum,
            time: slot.timeslot,
            type: slot.angemeldetAls,
            format: slot.format
          }));
          //closest dates first
          const sortBy = (reg1, reg2) => {
            if (reg1.date === reg2.date) {
              return reg1.time > reg2.time ? 1 : -1;
            } else {
              return reg1.date > reg2.date ? 1 : -1;
            }
          }
          newSlots.sort(sortBy);
          this.setState({appointments: newSlots, loading: false});
        } else {
          this.setState({loading: false, modalContent: 'error', error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({loading: false, modalContent: 'error', error: err.message});
      })
  }

  componentDidMount () {
    this.loadAppointments();
  }

  render () {
    let toDisplay = null;
    switch (this.state.modalContent) {
      case 'beforeSubmit':
        toDisplay = (
          <AuxComp>
          <p>Möchtest du für den ausgewählten Termin eine Hospitationsanfrage senden?</p>
          <div style={{display:'flex', flexWrap: 'wrap'}}>
            <Button buttonHandler={this.backdropClickHandler}>Abbrechen</Button>
            <Button buttonHandler={this.submitRequestHandler}>Anfrage senden</Button>
          </div>
          </AuxComp>
        );
        break;
      case 'success':
        toDisplay = (
          <AuxComp>
          <p>Die Anfrage wurde erfolgreich gesendet.</p>
          </AuxComp>
        );
        break;
      case 'error':
        toDisplay = (
          <AuxComp>
          <p>Beim Ausführen der Aktion ist ein Serverfehler aufgetreten: {this.state.error}</p>
          </AuxComp>
        );
        break;
      default:
        break;
    }

    return (
      <AuxComp>
        <Modal
          visible={this.state.modalContent}
          onBackdropClick={this.backdropClickHandler}>
          {toDisplay}
        </Modal>

        <h1 style={{textAlign: 'center'}}>Teamkalender</h1>
        {this.state.loading ?
          <Spinner /> :
          <TeamSlots
            appointments={this.state.appointments}
            onAppointmentClick={this.appointmentClickHandler} />}
      </AuxComp>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token
  };
};

export default connect(mapStateToProps)(TeamCalendar);
