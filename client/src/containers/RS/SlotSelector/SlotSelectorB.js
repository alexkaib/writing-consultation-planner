import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';
import { withRouter } from "react-router-dom";

import SlimWeekDisplayer from '../../SlimWeekDisplayer/SlimWeekDisplayer';
import FormatToggle from '../../../components/RS/FormatToggle/FormatToggle';
import TutorSelection from '../../../components/RS/TutorSelection/TutorSelection';
import Modal from '../../../components/UI/Modal/Modal';
import InfoBox from '../../../components/UI/InfoBox/InfoBox';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

import styles from './SlotSelectorStyle.module.css';

// TODO: make this dynamic
const numOfWeeksToShow = 8;

class SlotSelector extends Component {

  constructor(props) {
    super(props);
    const nextWeeks = [];
    let today = new Date();
    const currentWeekday = today.getUTCDay();
    today.setDate(today.getDate() + (1 - currentWeekday)); //set 'today' to current week's monday

    for (let i = 0; i < numOfWeeksToShow; i++) {
      for (let j = 0; j < 5; j++) {
        nextWeeks.push(today.toISOString().split('T')[0]);
        today.setDate(today.getDate() + 1);
      };
      today.setDate(today.getDate() + 2);
    };

    this.state = {
      days: nextWeeks,
      allSlots: [],
      availableSlots: [],
      availableTutors: [],
      selectedSlot: null,
      selectedFormat: 'analogue',
      selectedTutor: 'all',
      showModal: false,
      loading: true,
      error: null
    };
  }

  toggleFormatHandler = newFormat => {
    let slotsToShow = [];
    if (newFormat === 'both') {
      slotsToShow = [...this.state.allSlots];
    } else {
      slotsToShow = this.state.allSlots.filter(
        slot => slot[newFormat]
      );
    }
    if (this.state.selectedTutor !== 'all') {
      slotsToShow = slotsToShow.filter(
        slot => slot['ptId'] === this.state.selectedTutor
      );
    }
    this.setState({availableSlots: slotsToShow, selectedFormat: newFormat});
  }

  tutorSelectionHandler = event => {
    let selected = event.target.value;
    let slotsToShow = [];
    if (selected === 'all') {
      slotsToShow = [...this.state.allSlots];
    } else {
      selected = parseInt(selected);
      slotsToShow = this.state.allSlots.filter(
        slot => slot['ptId'] === selected
      );
    }
    if (this.state.selectedFormat !== 'both') {
      slotsToShow = slotsToShow.filter(
        slot => slot[this.state.selectedFormat]
      );
    }
    this.setState({availableSlots: slotsToShow, selectedTutor: selected});
  };

  slotSelectionHandler = (slotInfo) => {
    this.props.onSlotSelect(
      slotInfo.slotId, slotInfo.ptId, this.state.selectedFormat, slotInfo.date, slotInfo.time
    );
    this.setState({
      selectedSlot: slotInfo,
      showModal: true
    });
  }

  continueReservation = () => {
    const payload = {
      appointmentId: this.state.selectedSlot.slotId
    };
    //set "lastAccessed" of appointment to now
    axios.post('/rs/reserve-appointment.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0;
          this.props.history.push({pathname: '/rs/submit-slot'});
        } else {
          alert("Bei der Terminauswahl trat ein Fehler auf. Bitte lade die Seite neu und probiere es noch einmal.")
        }
      })
      .catch(err => {
        alert("Bei der Terminauswahl trat ein Fehler auf. Bitte lade die Seite neu und probiere es noch einmal.")
      })
  };

  cancelReservation = () => {
    this.setState({showModal: false, selectedSlot: null})
  };

  componentDidMount () {
    const newSlots = [];
    const availTutorsId = new Set();
    const newTutors = [];

    const url = '/rs/available-appointments.php';
    const params = new URLSearchParams([['type', this.props.consultationType]]);

    // gets appointments that are available, at least X days in the future (part of server config)
    // and have not been accessed in the last 10 minutes (all handled server-side)
    axios.get(url, {params})
      .then(res => {
        if (res.data.success === 1) {
          const slots = res.data.slots;
          for (let i in slots) {
            let slot = slots[i];
            newSlots.push({
              date: slot.datum,
              weekday: (new Date(slot.datum)).getUTCDay(),
              time: slot.fromTime + " - " + slot.toTime,
              slotId: slot.terminId,
              ptId: slot.tutorId,
              analogue: slot.analogue,
              digital: slot.digital,
              available: true,
            });
            if (!availTutorsId.has(slot.tutorId)) {
              newTutors.push({
                ptId: slot.tutorId,
                name: slot.firstName,
                subjects: slot.subjects
              });
              availTutorsId.add(slot.tutorId);
            }
          }
          const analogueSlots = newSlots.filter(slot => slot.analogue);
          //newSlots is a list of slot objects which store both the tutor id and the date + time
          this.setState({
            allSlots: newSlots, availableSlots: analogueSlots,
            availableTutors: newTutors, typeInfo: res.data.typeInfo,
            loading: false
          });
        }
        else {
          this.setState({loading: false, error: res.data.msg})
        }
      })
      .catch(err => {
        this.setState({loading: false, error: err.message});
      })
  }

  render () {
    const english = this.props.english;

    let modalContent = null;
    if (this.state.selectedSlot) {
      modalContent = (
        <div>
          <p>Du hast einen Termin am {this.state.selectedSlot.date.split('-').reverse().join('.')} von {this.state.selectedSlot.time} Uhr ausgewählt.</p>
          <p>Möchtest du diesen Termin für die nächsten 10 Minuten reservieren und zur Buchung fortfahren?</p>
          <div style={{display:'flex', flexWrap: 'wrap'}}>
            <Button buttonHandler={this.cancelReservation}>Abbrechen</Button>
            <Button buttonHandler={this.continueReservation}>Fortfahren</Button>
          </div>
        </div>
      );
      if (this.props.english) {
        modalContent = (
          <div>
            <p>You have selected an appointment on {this.state.selectedSlot.date.split('-').reverse().join('.')} from {this.state.selectedSlot.time}.</p>
            <p>Would you like to reserve this appointment for the next 10 minutes and proceed with the booking?</p>
            <div style={{display:'flex', flexWrap: 'wrap'}}>
              <Button buttonHandler={this.cancelReservation}>Cancel</Button>
              <Button buttonHandler={this.continueReservation}>Continue</Button>
            </div>
          </div>
        );
      }
    }

    let infoBox = null;
    if (this.state.typeInfo && this.state.typeInfo.info_de) {
      const infoContent = this.props.language === 'de' ?
        this.state.typeInfo.info_de : this.state.typeInfo.info_en;

      const infoHeading = this.props.language === 'de' ?
        this.state.typeInfo.name_de : this.state.typeInfo.name_en;

      infoBox = (
        <InfoBox
          header={infoHeading}
          info={infoContent}/>
      );
    }


    let mainContent = <Spinner />;
    let tutorSelectInfo;
    let genericTutor;

    let noAppointmentsMessage = english ?
      "Unfortunately, all appointments for the chosen category have been booked." :
      "Leider sind bereits alle Termine der gewählten Beratungsform vergeben.";

    if (english) {
      tutorSelectInfo = "Who would you like to consult with?";
      genericTutor = <option key='0' value='all'>Anyone available</option>;
    } else {
      tutorSelectInfo = "Von wem möchtest du beraten werden?";
      genericTutor = <option key='0' value='all'>Egal</option>;
    }

    if (!this.state.loading) {
      if (this.state.error) {
        mainContent = (
          <>
            <h1>{english?"Connection error":"Verbindungsfehler"}</h1>
            {english ?
              <p>A problem occured while trying to load the available appointments. Please try again later. Details: {this.state.error}</p> :
              <p>Beim Laden der Termine ist ein Server-Fehler aufgetreten. Bitte versuche es später erneut. Details: {this.state.error}</p>}
          </>
        )
      } else {
        let slotDisplay;
        if (this.state.availableSlots.length === 0) {
          slotDisplay = (
            <div style={{paddingLeft: '2em'}}>
            <h2>{english?"No appointments available":"Keine Termine verfügbar"}</h2>
            <p>{noAppointmentsMessage}</p>
            </div>
          );
        } else {
          slotDisplay = (
            <>
            <h2>Verfügbare Termine</h2>
            <SlimWeekDisplayer
              days={this.state.days}
              slots={this.state.availableSlots}
              slotSelectionHandler={this.slotSelectionHandler}
              numberOfWeeks={numOfWeeksToShow}
              language={this.props.language} />
            </>
          );
        }
        mainContent = (
          <>
            <div className={styles.MainContainer}>
              <div className={styles.Options}>

                <div className={styles.OptionsContainer}>
                <h2>{english?"Options":"Einstellungen"}</h2>
                  <FormatToggle
                    onFormatSelection={this.toggleFormatHandler}
                    currentFormat={this.state.selectedFormat}
                    english={english} />

                  <TutorSelection
                    availableTutors={this.state.availableTutors}
                    currentTutor={this.state.selectedTutor}
                    onTutorClick={this.tutorSelectionHandler}
                    infoText={tutorSelectInfo}
                    genericTutor={genericTutor} />
                </div>

                {infoBox}
              </div>


              <div className={styles.Slots}>
                {slotDisplay}
              </div>
            </div>
          </>
        )
      }
    }

    return (
      <>
        <div aria-hidden={this.state.showModal?"true":"false"}>
          {mainContent}
        </div>

        <Modal visible={this.state.showModal} onBackdropClick={this.cancelReservation}>
          {modalContent}
        </Modal>

      </>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSlotSelect: (slotId, tutorId, format, date, time) => dispatch({
      type: 'SELECT_SLOT',
      slotId: slotId,
      tutorId: tutorId,
      format: format,
      date: date,
      time: time
    })
  };
};

const mapStateToProps = (state) => {
  return {
    consultationType: state.rs.consultationType,
    english: state.rs.english,
    language: state.rs.language
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SlotSelector));
