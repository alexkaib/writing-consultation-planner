import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import CalendarDisplayer from '../../../components/PT/Calendar/CalendarDisplayer';
import WeekDisplayer from '../../WeekDisplayer/WeekDisplayer';
import SlotList from '../../../components/RS/SlotList/SlotList';
import CalendarOptions from './CalendarOptions';
import RSInfo from '../RSInfo/RSInfo';
import Modal from '../../../components/UI/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import ConsultationTypeSelection from '../ConsultationTypeSelection/ConsultationTypeSelection';
import Spinner from '../../../components/UI/Spinner/Spinner';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

class Calendar extends Component {
  state = {
    postedSlots: [],
    selectedSlot: null,
    whichModal: null,
    calendarView: true
  }

  slotSelectionHandler = (dateAndTime) => {
    const clickedSlot = this.state.postedSlots.find(slot => slot.slot === dateAndTime);
    //if datetime without previously created slot is clicked:
    if (!clickedSlot) {
      const newSelectedSlot = {
        date: dateAndTime.split('_')[0],
        time: dateAndTime.split('_')[1]
      };
      this.setState({whichModal: "createNewSlot", selectedSlot: newSelectedSlot});
      return null;
    }
    //if datetime with slot is clicked:
    else {
      const newSelectedSlot = {
        date: dateAndTime.split('_')[0],
        time: dateAndTime.split('_')[1],
        rsEmail: clickedSlot.rsEmail,
        rsId: clickedSlot.rsId,
        terminId: clickedSlot.terminId
      };
      if (clickedSlot.available) {
        this.setState({selectedSlot: newSelectedSlot, whichModal: "showSlot"});
      } else {
        this.setState({selectedSlot: newSelectedSlot, whichModal: "showAppointment"});
      }
      return null;
    }
  }

  infoButtonHandler = () => {
    this.setState({whichModal: "showRS"});
  }

  toggleViewHandler = () => {
    this.setState({calendarView: !this.state.calendarView});
  }

  // consultationTypes are received from ConsultationTypeSelection component
  createNewSlot = consultationTypes => {
    const payload = {
      date: this.state.selectedSlot.date,
      time: this.state.selectedSlot.time,
      rsId: this.state.selectedSlot.rsId,
      forms: consultationTypes,
      jwt: this.props.token
    };

    this.setState({whichModal: "spinner"});

    axios.post('/pt/create-appointment.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          const modalMessage = "Der Termin wurde erfolgreich erstellt.";
          const newSlots = [...this.state.postedSlots];
          newSlots.push({
            slot: this.state.selectedSlot.date + "_" + this.state.selectedSlot.time,
            terminId: res.data.terminId,
            available: 1,
            rsId: null,
            rsEmail: null
          });
          this.setState({
            whichModal: modalMessage,
            postedSlots: newSlots
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
      terminId: this.state.selectedSlot.terminId,
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
          const dateAndTime = this.state.selectedSlot.date + "_" + this.state.selectedSlot.time;
          let newSlots = this.state.postedSlots.filter(slot => {
            return slot.slot !== dateAndTime;
          });
          this.setState({postedSlots: newSlots, whichModal: modalMessage});
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
    const newSlots = [];
    const auth = {
      jwt: this.props.token
    }
    axios.post('/pt/my-appointments.php', auth)
      .then(res => {
        let slots = res.data.pt_appointments;
        for (let i in slots) {
          let slot = slots[i];
          newSlots.push({
            slot: slot.datum + "_" + slot.timeslot,
            terminId: slot.terminId,
            available: slot.available === '1',
            rsId: slot.rsId,
            rsEmail: slot.rsEmail
          });
        };
        this.setState({postedSlots: newSlots});
      })
      .catch(err => {
        console.log(err);
      })
  }

  render () {
    let modalContent = null;

    switch (this.state.whichModal) {
      case "createNewSlot":
        const dateList = this.state.selectedSlot.date.split('-');
        modalContent = (
          <ConsultationTypeSelection
            onTypeConfirm={this.createNewSlot}
            onModalClose={this.backdropClickHandler}
            message={"Am " + dateList[2] + "." + dateList[1] + "." + dateList[0] + " um " + this.state.selectedSlot.time + ":00 Uhr bietest du bisher keinen Termin an. Möchtest du einen anbieten?"}
            buttonText="Termin anbieten"
            />
        );
        break;
      case "showSlot":
        const dateAsList = this.state.selectedSlot.date.split('-');
        modalContent = (
          <AuxComp>
          <p>Du bietest am {dateAsList[2]}.{dateAsList[1]}.{dateAsList[0]} um {this.state.selectedSlot.time}:00 Uhr einen Termin an.
          Willst du ihn löschen?</p>
          <Button buttonHandler={this.deleteSlotHandler}>Löschen</Button>
          </AuxComp>
        );
        break;
      case "showAppointment":
        modalContent = (
          <AuxComp>
          <p>Der ausgewählte Termin ist reserviert und kann unter "Anmeldungen" verwaltet werden.</p>
          <p>Informationen über den*die Ratsuchende*n kannst du mit diesem Button einsehen:</p>
          <Button buttonHandler={this.infoButtonHandler}>RS-Infos</Button>
          <p>Falls der Termin fälschlicherweise ausgemacht wurde, kannst du ihn mit diesem Button löschen.
          Dieser Vorgang kann nicht rückgängig gemacht werden und Ratsuchende werden beim Löschen nicht automatisch informiert!
          Meistens ist es besser, die reguläre Archivierungsfunktion unter "Anmeldungen" oder die nebenstehende Krankmeldung
          zu nutzen.</p>
          <Button buttonHandler={this.deleteSlotHandler}>Trotz Anmeldung löschen (!)</Button>
          </AuxComp>
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
        <CalendarDisplayer>
          {this.state.calendarView ?
            <WeekDisplayer
              slots={this.state.postedSlots}
              slotSelectionHandler={this.slotSelectionHandler}
              numberOfWeeks={8}/> :
            <SlotList
              availableSlots={this.state.postedSlots}
              slotSelectionHandler={this.slotSelectionHandler}
              numberOfWeeks={8}/>
            }
          <CalendarOptions
            toggleViewHandler={this.toggleViewHandler}
            calendarView={this.state.calendarView}/>
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
    reservedDates: state.pt.datesWithAppointments
  };
};

export default connect(mapStateToProps)(Calendar);
