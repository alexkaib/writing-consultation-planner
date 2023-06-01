import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';
import { withRouter } from "react-router-dom";

import WeekDisplayer from '../../WeekDisplayer/WeekDisplayer';
import SlotList from '../../../components/RS/SlotList/SlotList';
import FormatToggle from '../../../components/RS/FormatToggle/FormatToggle';
import TutorSelection from '../../../components/RS/TutorSelection/TutorSelection';
import Modal from '../../../components/UI/Modal/Modal';
import InfoBox from '../../../components/RS/InfoBox/InfoBox';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';

import styles from './SlotSelectorStyle.module.css';

class SlotSelector extends Component {
  state = {
    allSlots: [],
    availableSlots: [],
    availableTutors: [],
    listView: false,
    selectedAppointmentId: null,
    selectedSlotAndTutor: null,
    selectedFormat: 'both',
    selectedTutor: 'all',
    showModal: false,
    loading: true,
    error: null
  }

  toggleViewHandler = () => {
    this.setState({listView: !this.state.listView});
  }

  toggleFormatHandler = newFormat => {
    let slotsToShow = [];
    if (newFormat === 'both') {
      slotsToShow = [...this.state.allSlots];
    } else {
      slotsToShow = this.state.allSlots.filter(
        slot => slot['type'].includes(newFormat)
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
    const selected = event.target.value;
    let slotsToShow = [];
    if (selected === 'all') {
      slotsToShow = [...this.state.allSlots];
    } else {
      slotsToShow = this.state.allSlots.filter(
        slot => slot['ptId'] === selected
      );
    }
    if (this.state.selectedFormat !== 'both') {
      slotsToShow = slotsToShow.filter(
        slot => slot['type'].includes(this.state.selectedFormat)
      );
    }
    this.setState({availableSlots: slotsToShow, selectedTutor: selected});
  };

  slotSelectionHandler = (dateAndTime) => {
    //create an array with all {slot: y-m-d_t, ptId: x} that correspond to selected slot
    let selectedSlots = this.state.availableSlots.filter(slot => slot['slot'] === dateAndTime);
    //clicking on an unavailabe slot does nothing
    if (selectedSlots.length === 0) {
      return;
    } else {
      // get first of the available appointments for the selected slot
      let appointment = selectedSlots.shift()
      // sends selection to store
      this.props.onSlotSelect(appointment, appointment.slotId, this.state.selectedFormat);
      this.setState({
        selectedSlotAndTutor: appointment,
        selectedAppointmentId: appointment.slotId,
        showModal: true
      });
    }
  };

  continueReservation = () => {
    const payload = {
      appointmentId: this.state.selectedAppointmentId,
      date: this.state.selectedSlotAndTutor.slot.split('_')[0],
      time: this.state.selectedSlotAndTutor.slot.split('_')[1],
      ptId: this.state.selectedSlotAndTutor.ptId
    };
    //set "lastAccessed" of appointment to now
    axios.post('/rs/reserve-appointment.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          let goTo;
          switch (this.props.consultationType) {
            case 'research':
              goTo = '/rs/research-submit';
              break;
            case 'methods':
              goTo = '/rs/methods-submit';
              break;
            default:
              goTo = '/rs/submit-slot';
          }
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0;
          this.props.history.push({pathname: goTo});
        } else {
          alert("Bei der Terminauswahl trat ein Fehler auf. Bitte lade die Seite neu und probiere es noch einmal.")
        }
      })
      .catch(err => {
        alert("Bei der Terminauswahl trat ein Fehler auf. Bitte lade die Seite neu und probiere es noch einmal.")
      })
  };

  cancelReservation = () => {
    this.setState({showModal: false, selectedSlotAndTutor: null, selectedAppointmentId: null})
  };

  componentDidMount () {
    const newSlots = [];
    const availTutorsId = new Set();
    const newTutors = [];

    const url = '/rs/available-appointments.php';
    const params = new URLSearchParams([['type', this.props.consultationType]]);
    //gets appointments that are available, at least three days in the future and have not been accessed in the last 10 minutes (handled server-side)
    axios.get(url, {params})
      .then(res => {
        if (res.data.success === 1) {
          const slots = res.data.slots;
          for (let i in slots) {
            let slot = slots[i];
            //client-side availability check, is redundant but safer
            if (slot.available) {
              newSlots.push({
                slot: slot.datum + "_" + slot.timeslot,
                slotId: slot.terminId,
                ptId: slot.tutorId,
                type: slot.name
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
          }
          let slotsToShow;
          // for librarians, only display slots of one library by default
          if (this.props.consultationType === 'research' && newTutors.length > 1) {
            slotsToShow = newSlots.filter(
                slot => slot['ptId'] === newTutors[0].ptId
            );
          } else {
            slotsToShow = newSlots;
          }
          //newSlots is a list of slot objects which store both the tutor id and the date + time
          this.setState({
            allSlots: newSlots, availableSlots: slotsToShow,
            availableTutors: newTutors, loading: false
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
    if (this.state.selectedSlotAndTutor) {
      modalContent = (
        <div>
          <p>Du hast einen Termin am {this.state.selectedSlotAndTutor.slot.split('_')[0].split('-')[2]}.{this.state.selectedSlotAndTutor.slot.split('_')[0].split('-')[1]}. um {this.state.selectedSlotAndTutor.slot.split('_')[1]}:00 Uhr ausgewählt.</p>
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
            <p>You have selected an appointment on {this.state.selectedSlotAndTutor.slot.split('_')[0].split('-')[2]}.{this.state.selectedSlotAndTutor.slot.split('_')[0].split('-')[1]}. at {this.state.selectedSlotAndTutor.slot.split('_')[1]}:00.</p>
            <p>Would you like to reserve this appointment for the next 10 minutes and continue to confirmation?</p>
            <div style={{display:'flex', flexWrap: 'wrap'}}>
              <Button buttonHandler={this.cancelReservation}>Cancel</Button>
              <Button buttonHandler={this.continueReservation}>Continue</Button>
            </div>
          </div>
        );
      }
    }

    let mainContent = <Spinner />;
    let tutorSelectInfo;
    let genericTutor;
    let infoBoxContent;
    let noAppointmentsMessage = english ?
      "Unfortunately, all appointments for the chosen category have been booked. We usually update this page on Mondays, so check back here then." :
      "Leider sind bereits alle Termine der gewählten Beratungsform vergeben. Neue Termine werden in der Regel montags hinzugefügt.";
    switch (this.props.consultationType) {
      case 'research':
        if (english) {
          tutorSelectInfo = "Which library would you like to consult with?";
          infoBoxContent = (
            <AuxComp>
            <h3>Not fitting your schedule?</h3>
            <p>Just send us an e-mail to arrange a different meeting time.</p>
            <ul>
              <li><a href="mailto:information@ub.uni-frankfurt.de">Zentralbibliothek (allgemeine Anfragen)</a></li>
              <li><a href="mailto:bzg-info@ub.uni-frankfurt.de">Bibliothekszentrum Geisteswissenschaften</a></li>
              <li><a href="mailto:bsp@ub.uni-frankfurt.de">Bibliothek Sozialwissenschaften und Psychologie</a></li>
              <li><a href="mailto:bruw-info@ub.uni-frankfurt.de">Bibliothek für Recht und Wirtschaft</a></li>
              <li><a href="mailto:bnat-teams@ub.uni-frankfurt.de">Bibliothek für Naturwissenschaften</a></li>
            </ul>
            </AuxComp>
          );
        } else {
          tutorSelectInfo = "Welcher Standort soll dich bei deiner Recherche unterstützen?";
          infoBoxContent = (
            <AuxComp>
            <h3>Kein passender Termin dabei?</h3>
            <p>Sie können gerne per E-Mail einen Alternativtermin mit uns vereinbaren.</p>
            <ul>
              <li><a href="mailto:information@ub.uni-frankfurt.de">Zentralbibliothek (allgemeine Anfragen)</a></li>
              <li><a href="mailto:bzg-info@ub.uni-frankfurt.de">Bibliothekszentrum Geisteswissenschaften</a></li>
              <li><a href="mailto:bsp@ub.uni-frankfurt.de">Bibliothek Sozialwissenschaften und Psychologie</a></li>
              <li><a href="mailto:bruw-info@ub.uni-frankfurt.de">Bibliothek für Recht und Wirtschaft</a></li>
              <li><a href="mailto:bnat-teams@ub.uni-frankfurt.de">Bibliothek für Naturwissenschaften</a></li>
            </ul>
            </AuxComp>
          );
        }
        genericTutor = null;
        if (this.state.selectedFormat === 'analogue') {
          noAppointmentsMessage = english ?
            "Due to the current situation we are offering online consultations only." :
            "Aufgrund der aktuellen Situation sind zurzeit keine Präsenztermine möglich.";
        }
        break;
      default:
        if (english) {
          tutorSelectInfo = "Who would you like to consult with?";
          genericTutor = <option key='0' value='all'>Tutor from any discipline</option>;
        } else {
          tutorSelectInfo = "Von wem möchtest du beraten werden?";
          genericTutor = <option key='0' value='all'>Egal - Fachübergreifend</option>;
        }
    }

    if (!this.state.loading) {
      if (this.state.error) {
        mainContent = (
          <AuxComp>
            <h1>{english?"Connection error":"Verbindungsfehler"}</h1>
            {english ?
              <p>A problem occured while trying to load the available appointments. Please try again later. Details: {this.state.error}</p> :
              <p>Beim Laden der Termine ist ein Server-Fehler aufgetreten. Bitte versuche es später erneut. Details: {this.state.error}</p>}
          </AuxComp>
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
          if (this.state.listView) {
            slotDisplay = (
              <AuxComp>
              <h2 style={{textAlign:'center'}}>{english?"Available appointments (list view)":"Offene Termine (Listenansicht)"}</h2>
              <SlotList
                availableSlots={this.state.availableSlots}
                slotSelectionHandler={this.slotSelectionHandler}
                numberOfWeeks={3}/>
              </AuxComp>
            );
          } else {
            slotDisplay = (
              <AuxComp>
              <h2 style={{textAlign:'center'}}>{english?"Available appointments (calendar view)":"Offene Termine (Kalenderansicht)"}</h2>
              <WeekDisplayer
                slots={this.state.availableSlots}
                slotSelectionHandler={this.slotSelectionHandler}
                disableEmptySlots={true}
                headline={null}
                //GO students can book further in advance
                numberOfWeeks={this.props.consultationType === 'go' ? 6:3}/>
              </AuxComp>
            )
          }
        }
        mainContent = (
          <AuxComp>
            <div className={styles.MainContainer}>
              <div className={styles.Options}>
              <h2 style={{textAlign:'center'}}>{english?"Options":"Einstellungen"}</h2>
              <div className={styles.OptionsContainer}>
                  {this.props.consultationType === 'textfeedback' ?
                    <p style={{textAlign:'center'}}>Du erhältst dein Textfeedback spätestens am ausgewählten Termin.</p> :
                    <FormatToggle
                      onFormatSelection={this.toggleFormatHandler}
                      currentFormat={this.state.selectedFormat}
                      english={english} />
                  }
                  <TutorSelection
                    availableTutors={this.state.availableTutors}
                    currentTutor={this.state.selectedTutor}
                    onTutorClick={this.tutorSelectionHandler}
                    infoText={tutorSelectInfo}
                    genericTutor={genericTutor} />

                  <Button buttonHandler={this.toggleViewHandler}>
                    {english?"List view":"Listenansicht"}
                  </Button>
                </div>

                {this.props.consultationType === 'research' && window.outerWidth >= 700 ?
                  <InfoBox content={infoBoxContent} /> : null
                }
              </div>
              <div className={styles.Slots}>
                {slotDisplay}
              </div>
            </div>
            {this.props.consultationType === 'research' && window.outerWidth < 700 ?
              <InfoBox content={infoBoxContent} /> : null
            }
          </AuxComp>
        )
      }
    }

    return (
      <AuxComp>
        <div aria-hidden={this.state.showModal?"true":"false"}>
          {mainContent}
        </div>

        <Modal visible={this.state.showModal} onBackdropClick={this.cancelReservation}>
          {modalContent}
        </Modal>

      </AuxComp>
    );
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSlotSelect: (timeAndTutor, appointmentId, format) => dispatch({
      type: 'SELECT_SLOT',
      timeAndTutor: timeAndTutor,
      appointmentId: appointmentId,
      selectedFormat: format
    })
  };
};

const mapStateToProps = (state) => {
  return {
    consultationType: state.rs.consultationType,
    termsAccepted: state.rs.termsAccepted,
    english: state.rs.english
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SlotSelector));
