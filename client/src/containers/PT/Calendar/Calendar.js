import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import CalendarDisplayer from '../../../components/PT/Calendar/CalendarDisplayer';
import SlimWeekDisplayer from '../../SlimWeekDisplayer/SlimWeekDisplayer';
import CalendarOptions from './CalendarOptions';
import RSInfo from '../RSInfo/RSInfo';
import Modal from '../../../components/UI/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import ConsultationTypeSelection from '../ConsultationTypeSelection/ConsultationTypeSelection';
import Spinner from '../../../components/UI/Spinner/Spinner';
import AuxComp from '../../../hoc/AuxComp/AuxComp';


class Calendar extends Component {
  constructor(props) {
    super(props);
    // create list of days for next eight weeks
    const nextEightWeeks = [];
    let today = new Date();
    const currentWeekday = today.getUTCDay();
    today.setDate(today.getDate() + (1 - currentWeekday)); //set 'today' to current week's monday

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 5; j++) {
        nextEightWeeks.push(today.toISOString().split('T')[0]);
        today.setDate(today.getDate() + 1);
      };
      today.setDate(today.getDate() + 2);
    };

    this.state = {
      days: nextEightWeeks,
      slots: [],
      selectedSlot: null,
      whichModal: null,
      calendarView: true,
      loading: false,
      error: null
    };
  }

  slotSelectionHandler = (slotInfo) => {
    const newSelectedSlot = {
      date: slotInfo.date,
      time: slotInfo.time,
      rsId: slotInfo.rsId,
      slotId: slotInfo.slotId
    };
    if (slotInfo.available) {
      this.setState({selectedSlot: newSelectedSlot, whichModal: "showSlot"});
    } else {
      this.setState({selectedSlot: newSelectedSlot, whichModal: "showAppointment"});
    }
    return null;
  }
  // receives "YYYY-MM-DD" string
  openAppointmentConfig = (date) => {
    this.setState({
      whichModal: "createNewSlot",
      selectedSlot: {date: date, time: null}
    });
    // TODO: Ask for time, then save to db
  }

  infoButtonHandler = () => {
    this.setState({whichModal: "showRS"});
  }

  toggleViewHandler = () => {
    this.setState({calendarView: !this.state.calendarView});
  }

  refreshAppointments = () => {
    const newSlots = [];
    const auth = {
      jwt: this.props.token
    }
    axios.post('/pt/my-appointments.php', auth)
      .then(res => {
        if (res.data.success === 1) {
          let slots = res.data.pt_appointments;
          for (let i in slots) {
            let slot = slots[i];
            newSlots.push({
              slotId: slot.terminId,
              date: slot.datum,
              weekday: (new Date(slot.datum)).getUTCDay(),
              time: slot.fromTime + ' - ' + slot.toTime,
              available: slot.available === '1',
              ptId: slot.tutorId,
              rsId: slot.rsId
            });
          };
          this.setState({slots: newSlots});
        } else {
          this.setState({whichModal: res.data.msg})
        }
      })
      .catch(err => {
        this.setState({whichModal: err.message})
      })
  }

  // consultationTypes and times are received from ConsultationTypeSelection component
  createNewSlot = appointmentInfo => {
    let payload = {
      date: this.state.selectedSlot.date,
      appointmentInfo: appointmentInfo,
      jwt: this.props.token
    };

    payload = JSON.stringify(payload);

    this.setState({whichModal: "spinner"});

    axios.post('/pt/create-appointments.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          const modalMessage = "Termine wurden erfolgreich erstellt.";

          this.refreshAppointments();

          this.setState({
            whichModal: modalMessage
          });
          return;

        } else {
          this.setState({whichModal: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({whichModal: err.message});
      })
  }

  deleteSlotHandler = () => {
    const payload = {
      terminId: this.state.selectedSlot.slotId,
      rsId: this.state.selectedSlot.rsId,
      date: this.state.selectedSlot.date,
      time: this.state.selectedSlot.time,
      jwt: this.props.token
    };
    this.setState({whichModal: "spinner"});

    axios.post('/pt/delete-appointment.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          const modalMessage = "Der Termin wurde erfolgreich gelöscht.";
          let newSlots = this.state.slots.filter(slot => {
            return slot.slotId !== this.state.selectedSlot.slotId;
          });
          this.setState({slots: newSlots, whichModal: modalMessage});
        } else {
          this.setState({whichModal: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({whichModal: err.message});
      })
  }

  backdropClickHandler = () => {
    this.setState({
      whichModal: null,
      selectedSlot: null
    })
  }

  componentDidMount () {
    this.refreshAppointments();
  }

  render () {
    let modalContent = null;

    switch (this.state.whichModal) {
      case "createNewSlot":
        modalContent = (
          <ConsultationTypeSelection
            onTypeConfirm={this.createNewSlot}
            onModalClose={this.backdropClickHandler}
            message={""}
            buttonText="Termin anbieten"
            />
        );
        break;
      case "showSlot":
        const dateAsList = this.state.selectedSlot.date.split('-');
        modalContent = (
          <>
          <p>Du bietest am {dateAsList[2]}.{dateAsList[1]}.{dateAsList[0]} von {this.state.selectedSlot.time} Uhr einen Termin an.
          Willst du ihn löschen?</p>
          <Button buttonHandler={this.deleteSlotHandler}>Löschen</Button>
          </>
        );
        break;
      case "showAppointment":
        modalContent = (
          <>
          <p>Der ausgewählte Termin ist reserviert und kann unter "Anmeldungen" verwaltet werden.</p>
          <p>Informationen über den*die Ratsuchende*n kannst du mit diesem Button einsehen:</p>
          <Button buttonHandler={this.infoButtonHandler}>RS-Infos</Button>
          <p>Falls der Termin fälschlicherweise ausgemacht wurde, kannst du ihn mit diesem Button löschen.
          Dieser Vorgang kann nicht rückgängig gemacht werden und Ratsuchende werden beim Löschen nicht automatisch informiert!
          Meistens ist es besser, die reguläre Archivierungsfunktion unter "Anmeldungen" zu nutzen.</p>
          <Button buttonHandler={this.deleteSlotHandler}>Trotz Anmeldung löschen (!)</Button>
          </>
        );
        break;
      case "showRS":
        modalContent = <RSInfo rsId={this.state.selectedSlot.rsId} />;
        break;
      case "spinner":
        modalContent = <Spinner />;
        break;
      default:
        modalContent = <p>{this.state.whichModal}</p>
    }

    return (
      <AuxComp>
        <Modal visible={this.state.whichModal?true:false} onBackdropClick={this.backdropClickHandler}>
          {modalContent}
        </Modal>
        <CalendarDisplayer language={this.props.language}>
          <CalendarOptions
            toggleViewHandler={this.toggleViewHandler}
            calendarView={this.state.calendarView}/>

          <SlimWeekDisplayer
            days={this.state.days}
            addNewSlotHandler={this.openAppointmentConfig}
            slotSelectionHandler={this.slotSelectionHandler}
            slots={this.state.slots}
            numberOfWeeks={8}
            language={this.props.language} />

        </CalendarDisplayer>
      </AuxComp>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token,
    reservedDates: state.pt.datesWithAppointments,
    language: state.rs.language
  };
};

export default connect(mapStateToProps)(Calendar);
