import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import AuxComp from '../../../hoc/AuxComp/AuxComp';
import Modal from '../../../components/UI/Modal/Modal';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Form from '../../../components/RS/Submit/Form/Form';
import SubmitFormButtons from '../../../components/RS/Submit/SubmitFormButtons/SubmitFormButtons';


class SlotSubmitter extends Component {

  state = {
    showModal: false,
    error: null,
    slotAndTutor: this.props.slotAndTutor,
    appointmentId: this.props.appointmentId,
    date: this.props.slotAndTutor.slot.split('_')[0],
    time: this.props.slotAndTutor.slot.split('_')[1],
    rsInfo: {
      firstName: '',
      lastName: '',
      email: '',
      repeatEmail: '',
      semester: '1-2',
      abschluss: 'bachelor',
      fachbereich: 1,
      fach: '',
      deutschAls: 'Erstsprache',
      gender: 'Männlich',
      erstStudierend: 1,
      elternHerkunft: 'beide in Deutschland',
      genre: 'Hausarbeit',
      comment: '',
      terminReasons: {
        themaEntwickeln: false,
        feedback: false,
        anfangen: false,
        struktur: false,
        unsicher: false,
        dozEmpfehlung: false,
        kritik: false,
        formales: false,
        sonstige: false
      },
      reachedBy: {
        flyer: false,
        dozierende: false,
        socialMedia: false,
        webseite: false,
        ov: false,
        kommilitonen: false,
        sz: false
      }
    },
    textfile: null,
    invalidForm: false,
    ptName: null
  }

  inputHandler = (event) => {

    const currentInfo = {...this.state.rsInfo};

    switch (event.target.type) {
      case 'text':
      case 'email':
      case 'select-one':
        currentInfo[event.target.id] = event.target.value;
        this.setState({
          rsInfo: currentInfo
        });
        break;

      case 'checkbox':
        const checkboxesName = event.target.parentElement.parentElement.id;
        const clickedBox = event.target.value;
        const updatedCheckboxes = currentInfo[checkboxesName];
        updatedCheckboxes[clickedBox] = !updatedCheckboxes[clickedBox];
        currentInfo[checkboxesName] = updatedCheckboxes;
        this.setState({
          rsInfo: currentInfo
        });
        break;

      case 'file':
        this.setState({textfile: event.target.files[0]});
        break;

      default:
      currentInfo[event.target.id] = event.target.value;
      this.setState({
        rsInfo: currentInfo
      });
    }
  };

  submitHandler = () => {
    const currentInfo = {...this.state.rsInfo};
    if (currentInfo.firstName < 1 || currentInfo.lastName < 1 || !(currentInfo.email.includes('@')) || currentInfo.email !== currentInfo.repeatEmail) {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
      this.setState({invalidForm: true});
      return null;
    }
    else {

      this.setState({showModal: true});

      const formData = new FormData();

      const payload = {
        appointmentId: this.props.appointmentId,
        date: this.props.slotAndTutor.slot.split('_')[0],
        time: this.props.slotAndTutor.slot.split('_')[1],
        ptId: this.props.slotAndTutor.ptId,
        consultationType: this.props.consultationType,
        format: this.props.selectedFormat,
        termsAccepted: this.props.termsAccepted,
        rsInfo: this.state.rsInfo
      };

      formData.append("payload", JSON.stringify(payload));

      if (this.state.textfile) {
        const filesize = ((this.state.textfile.size/1024)/1024).toFixed(4); // MB
        if (filesize <= 10) {
          formData.append(
            "textfile",
            this.state.textfile,
            this.state.textfile.name
          );
        } else {
          this.setState({showModal: true, error: "Ausgewählte Textdatei ist größer als 10 MB."});
          return null;
        }
      }
      axios.post('/rs/confirm-appointment.php', formData)
      .then(res => {
        console.log(res);
        if (res.data.success === 1) {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0;
          this.props.history.push({pathname: '/rs/success/'});
        } else {
          this.setState({showModal: true, error: res.data.msg});
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({showModal: true, error: err.message});
      })
    }
  }

  goBackHandler = () => {
    const payload = {
      appointmentId: this.props.appointmentId
    };
    //reset "lastAccessed" of appointment
    axios.post('/rs/un-reserve-appointment.php', payload)
      .then(res => {
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0;
          this.props.history.push({pathname: '/rs/select-slot'})
      })
      .catch(err => {
        console.log(err);
      })
  }

  backdropClickHandler = () => {
    this.setState({showModal: false, error: null});
  }

  render () {
    const currentRSInfo = {...this.state.rsInfo};

    let modalContent = (
      <Spinner />
    );

    if (this.state.error) {
      modalContent = (
        <div>
        <p>Beim Reservieren des Termins ist ein Fehler aufgetreten. Falls das Problem bestehen bleibt, kontaktiere uns bitte unter <a href="mailto:schreibzentrum@dlist.uni-frankfurt.de">schreibzentrum@dlist.uni-frankfurt.de</a>.</p>
        <p>Fehlermeldung: {this.state.error}</p>
        </div>
      );
    }

    return (
      <AuxComp>
        <Modal visible={this.state.showModal} onBackdropClick={this.backdropClickHandler}>
          {modalContent}
        </Modal>
        <Form
          date={this.state.date}
          time={this.state.time}
          rsInfo={this.state.rsInfo}
          inputHandler={this.inputHandler}
          invalidForm={this.state.invalidForm}
          english={this.props.english} />
        <SubmitFormButtons
          available={currentRSInfo.firstName.length >= 1 && currentRSInfo.lastName.length >= 1 && currentRSInfo.email.includes('@')}
          goBackHandler={this.goBackHandler}
          submitHandler={this.submitHandler}
          english={this.props.english} />
      </AuxComp>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    slotAndTutor: state.rs.selectedSlotAndTutor,
    appointmentId: state.rs.selectedAppointmentId,
    consultationType: state.rs.consultationType,
    selectedFormat: state.rs.selectedFormat,
    termsAccepted: state.rs.termsAccepted,
    english: state.rs.english
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SlotSubmitter));
