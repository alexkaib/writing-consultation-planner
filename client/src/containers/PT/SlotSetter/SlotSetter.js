import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import ConsultationTypeSelection from '../ConsultationTypeSelection/ConsultationTypeSelection';
import AuxComp from '../../../hoc/AuxComp/AuxComp';
import Modal from '../../../components/UI/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Days from '../../../components/PT/Slots/Days/Days';
import DayButtons from '../../../components/PT/Slots/DayButtons/DayButtons';
import SubmitButtons from '../../../components/PT/Slots/SubmitButtons/SubmitButtons';

class SlotSetter extends Component {
  state = {
    days: ["1", "2", "3", "4", "5"],
    showModal: false,
    showTypeSelection: false,
    loading: false,
    error: null,
    selectedSlots: [], //2-13 (tuesdays at 13:00), 4-11 (thursdays at 11:00), etc. list
    //another info to send to a server could be amount of offered slots, corresponging to priority
    //a sensible amount of maximum slots to offer seems 5, this could easily be implemented by checking the .length of selectedSlots
    numberOfWeeks: 1,
    slotsToPush: []
  }

  slotClickHandler = clickedSlot => {
    const newSlots = [...this.state.selectedSlots];
    if (newSlots.includes(clickedSlot)) {
      newSlots.splice(newSlots.indexOf(clickedSlot), 1);
    } else {
      newSlots.push(clickedSlot);
    };
    this.setState({selectedSlots: newSlots});
  }

  weekSelectHandler = (event) => {
    this.setState({numberOfWeeks: event.target.value});
  }

  backdropClickHandler = () => {
    this.setState({showModal: false, showTypeSelection: false});
  }

  backHomeHandler = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
    this.props.history.push('/pt/landing');
    return null;
  }

  selectConsultationTypes = () => {
    if (this.state.selectedSlots.length < 1) return null;
    this.setState({showModal: true, showTypeSelection: true});
  }

  confirmSlotsHandler = consultationTypes => {

    this.setState({showModal: true, showTypeSelection: false, loading: true});
    const payload = {
      weekday_and_slot_list: this.state.selectedSlots,
      number_of_weeks: this.state.numberOfWeeks,
      forms: consultationTypes,
      jwt: this.props.token
    };

    axios.post('/pt/create-appointments.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({loading: false, selectedSlots: []});
        } else {
          this.setState({
            loading: false,
            error: "Wegen eines Server-Fehlers konnten die Daten nicht übermittelt werden. Fehler: " + res.data.msg
          });
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: "Wegen eines Server-Fehlers konnten die Daten nicht übermittelt werden. Fehler: " + err
        });
      })
    }

  render () {

    let modalContent = (
      <AuxComp>
      <p>Deine Termine wurden erfolgreich erstellt und sind jetzt für Ratsuchende sichtbar. Nutze den Beratungskalender, um angebotene Termine zu verwalten.</p>
      <Button buttonHandler={this.backHomeHandler}>Zurück zum Menü</Button>
      </AuxComp>
    );

    if (this.state.showTypeSelection) {
      modalContent = (
        <ConsultationTypeSelection
          onTypeConfirm={this.confirmSlotsHandler}
          message="Welche Beratungsform(en) möchtest du an den gewählten Terminen anbieten?"
          buttonText="Termine anbieten"
          />
      );
    }
    if (this.state.loading) {
      modalContent = <Spinner />;
    }
    if (this.state.error !== null) {
      modalContent = (
        <p>{this.state.error}</p>
      );
    }

    let toDisplay = (
      <AuxComp>
        <Modal visible={this.state.showModal} onBackdropClick={this.backdropClickHandler}>
          {modalContent}
        </Modal>
        <h1 style={{textAlign: 'center'}}>Terminauswahl</h1>
        <h3>Wähle Wochentage und Uhrzeiten aus, an denen du beraten willst. Bereits vorhandene Termine bleiben unverändert und können über den Beratungskalender verwaltet werden.</h3>
        <DayButtons />
        <Days
          days={this.state.days}
          selectedSlots={this.state.selectedSlots}
          onSlotClick={this.slotClickHandler} />
        <SubmitButtons
          weekSelectHandler={this.weekSelectHandler}
          submittable={this.state.selectedSlots.length > 0}
          confirmSlotsHandler={this.selectConsultationTypes} />
      </AuxComp>
    );

    if (!this.props.loggedIn) {
      toDisplay = (
        <h3>Du konntest nicht authentifiziert werden. Bitte kehre zum Login-Bildschirm zurück und melde dich erneut an.</h3>
      );
    }

    return toDisplay;
  }
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token
  }
};

export default withRouter(connect(mapStateToProps)(SlotSetter));
