import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';
import { withRouter } from "react-router-dom";
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import de from "date-fns/locale/de";
import format from "date-fns/format";
import RegistrationsList from '../../../components/PT/Registrations/RegistrationsList/RegistrationsList';

import RSInfo from '../RSInfo/RSInfo';
import Modal from '../../../components/UI/Modal/Modal';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import Spinner from '../../../components/UI/Spinner/Spinner';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

registerLocale("de", de);

class Registrations extends Component {
  state = {
    showModal: false,
    showRS: false,
    showDatePicker: false,
    showSendConference: false,
    showReserveRoom: false,
    loading: true,
    error: null,
    success: null,
    followUpDateTime: new Date(),
    selectedTerminId: null,
    selectedRsId: null,
    evalPayload: null,
    archivePayload: null,
    //[{terminId: 32, date: '2020-12-30', time: 12, rsId: 14, protocolId: 12, followUpId: 24}, {terminId: 33, date: '2020-12-30', time: 13, rsId: 15, protocolId: null, followUpId: null}]
    registeredAppointments: [],
    tutors: [],
    selectedTutorId: null
  }

  //depending on type, id can be either terminId, protocolId, followUpId or a tuple of (terminId, rsId)
  iconClickHandler = (id, type) => {
    switch (type) {
      case 'info':
        this.setState({selectedRsId: id, showModal: true, showRS: true});
        break;

      case 'reserveRoom':
        this.setState(
          {showModal: true, selectedTerminId: id},
          () => this.loadRoomReservation(id)
        );
        break;

      case 'sendEvalLink':
        const [appointmentId, rsEmail, rsName] = id;
        const payload = {
          terminId: appointmentId,
          rsEmail: rsEmail,
          rsName: rsName,
          role: this.props.role
        };
        this.setState({evalPayload: payload, showModal: true});
        break;

      case 'createProtocol':
        this.props.onCreateProtocol(id);
        this.props.history.push('/pt/protocol');
        break;

      case 'viewProtocol':
        this.props.onViewProtocol(id);
        this.props.history.push('/pt/protocol');
        break;

      case 'createFollowUp':
        this.setState({showModal: true, showDatePicker: true, selectedTerminId: id[0], selectedRsId: id[1]})
        break;

      case 'viewFollowUp':
        const displayedAppointments = this.state.registeredAppointments;
        const followUpIndex = displayedAppointments.findIndex(el => el.terminId === id);
        if (followUpIndex !== null) {
          const newAppointments = displayedAppointments.map((el, i) => {
            if (i === followUpIndex) {
              el["highlighted"] = true;
            } else {
              el["highlighted"] = false;
            }
            return el;
          });
          this.setState({registeredAppointments: newAppointments});
        } else {
          const errorMessage = "Die ausgewählte Folgeberatung befindet sich nicht unter deinen aktuellen Anmeldungen. Entweder hast du sie bereits archiviert oder es gab einen Serverfehler. ID der Folgeberatung: " + id.toString();
          this.setState({showModal: true, error: errorMessage});
        }
        break;

      case 'sendConference':
        this.setState({showModal: true, showSendConference: true, selectedTerminId: id});
        break;

      case 'archive':
        //delete termin from view and, if no follow-up present, delete contact info of RS
        //to do so, receives an array with [terminId, followUpId, rsId]
        const [terminId, followUpId, rsId] = id;
        const archivePayload = {
          terminId: terminId,
          followUpExists: followUpId ? true:false,
          rsId: rsId
        };
        this.setState({archivePayload: archivePayload, selectedTerminId: terminId, showModal: true});
        break;

      default:
        break;
    }
  }

  backdropClickHandler = () => {
    this.setState({
      showModal: false,
      showRS: false,
      showDatePicker: false,
      showSendConference: false,
      showReserveRoom: false,
      selectedRsId: null,
      evalPayload: null,
      archivePayload: null,
      error: null,
      success: null
    }, () => this.loadAppointments());
  }

  loadRoomReservation = (id) => {
    const selectedAppointment = this.state.registeredAppointments.find(
      appointment => appointment.terminId === id
    )

    const weekday = new Date(selectedAppointment.date).getDay();

    if (selectedAppointment.roomReserved === '1') {
      this.setState({success: 'Für diesen Termin ist der Beratungsraum bereits für dich reserviert.', loading: false})
    } else {

      const payload = {
        terminId: id,
        terminDate: selectedAppointment.date,
        terminTime: selectedAppointment.time,
        jwt: this.props.token
      }

      axios.post('/pt/check-room-availability.php', payload)
        .then(res => {
          if (res.data.success === 1) {
            if (res.data.available) {
              this.setState({showReserveRoom: true, loading: false});
            } else {
              this.setState({error: "Am ausgewählten Termin ist der Raum bereits reserviert.", loading: false});
            }
          } else {
            this.setState({error: res.data.msg});
          }
        })
        .catch(err => {
          this.setState({showModal: true, error: err.message, loading: false});
        })
    }
  }

  confirmRoomReservation = () => {
    const payload = {
      terminId: this.state.selectedTerminId,
      jwt: this.props.token
    }

    axios.post('/pt/reserve-room.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({showReserveRoom: false, success: res.data.msg})
        } else {
          this.setState({showReserveRoom: false, error: res.data.msg})
        }
      })
      .catch(err => {
        this.setState({showReserveRoom: false, error: err.message});
      })
  }

  saveFollowUpHandler = () => {
    const followUpDateTime = this.state.followUpDateTime;

    const followUpDate = format(followUpDateTime, 'yyyy-MM-dd');
    const followUpTime = format(followUpDateTime, 'HH');
    const followUpWeekday = followUpDateTime.getDay();

    const payload = {
      followUpDate: followUpDate,
      followUpTime: followUpTime,
      followUpWeekday: followUpWeekday,
      previousTerminId: this.state.selectedTerminId,
      rsId: this.state.selectedRsId,
      jwt: this.props.token
    };

    axios.post('/pt/create-follow-up.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({showDatePicker: false, success: 'Der Termin für die Folgeberatung wurde erstellt!'})
        } else {
          this.setState({showDatePicker: false, error: res.data.msg + ' Der Folgeberatungstermin wurde nicht erstellt.'});
        }
      })
      .catch(err => {
        this.setState({showDatePicker: false, error: 'Der Folgeberatungstermin konnte nicht erstellt werden. ' + err});
      })
  }

  confirmEvalHandler = () => {
    const payload = {...this.state.evalPayload};
    payload["jwt"] = this.props.token;
    axios.post('/pt/send-evaluation.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({evalPayload: null, success: res.data.msg});
        } else {
          this.setState({evalPayload: null, error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({evalPayload: null, error: 'Der Evaluationslink konnte nicht verschickt werden. ' + err.message});
      })
  }

  sendConferenceHandler = () => {
    const payload = {
      tutorId: this.state.selectedTutorId,
      terminId: this.state.selectedTerminId,
      jwt: this.props.token
    };

    axios.post('/pt/transfer-appointment.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          this.setState({showSendConference: false, valPayload: null, success: res.data.msg});
        } else {
          this.setState({showSendConference: false, valPayload: null, error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({showSendConference: false, valPayload: null, error: 'Die Beratung konnte nicht übertragen werden. ' + err.message});
      })
  }

  confirmArchiveHandler = () => {
    const payload = {...this.state.archivePayload};
    payload["jwt"] = this.props.token;
    axios.post('/pt/archive-appointment.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          const newRegistrations = this.state.registeredAppointments.filter(reg => reg.terminId !== this.state.selectedTerminId);
          this.setState({registeredAppointments: newRegistrations, archivePayload: null, success: res.data.msg});
        } else {
          this.setState({archivePayload: null, error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({archivePayload: null, error: 'Die Anmeldung konnte nicht archiviert werden. ' + err});
      })
  }

  confirmArchiveHandlerWithoutProtocol = rsWasPresent => {
    const payload = {...this.state.archivePayload};
    payload["rsWasPresent"] = rsWasPresent ? 1 : 0;
    payload["jwt"] = this.props.token;

    axios.post('/pt/archive-appointment.php', payload)
      .then(res => {
        if (res.data.success === 1) {
          const newRegistrations = this.state.registeredAppointments.filter(reg => reg.terminId !== this.state.selectedTerminId);
          this.setState({registeredAppointments: newRegistrations, archivePayload: null, success: res.data.msg});
        } else {
          this.setState({archivePayload: null, error: res.data.msg});
        }
      })
      .catch(err => {
        this.setState({archivePayload: null, error: 'Die Anmeldung konnte nicht archiviert werden. ' + err});
      })
  }

  //get all appointments where available = 0 from server, also tutors for transfer function
  loadAppointments = () => {
    const newRegistrations = [];
    const auth = {
      jwt: this.props.token
    }
    axios.post('/pt/my-registrations.php', auth)
      .then(res => {
        if (res.data.success === 1) {
          const registrations = res.data.registrations;
          for (let i in registrations) {
            let registration = registrations[i];
            newRegistrations.push({
              terminId: registration.terminId,
              date: registration.datum,
              time: registration.timeslot,
              rsId: registration.rsId,
              rsFirstName: registration.firstName,
              rsLastName: registration.lastName,
              rsEmail: registration.email,
              evaluationSent: registration.evaluationSent,
              protocolId: registration.protocolId,
              followUpId: registration.followUpId,
              roomReserved: registration.roomReservation,
              highlighted: false
            });
          };
          const sortBy = (reg1, reg2) => {
            if (reg1.date === reg2.date) {
              return reg1.time > reg2.time ? 1 : -1;
            } else {
              return reg1.date > reg2.date ? 1 : -1;
            }
          }
          newRegistrations.sort(sortBy);

          const tutors = res.data.tutors.map(
            tutor => {
              return {label: tutor.firstName + ' ' + tutor.lastName, value:tutor.ptId}
          });

          // sort alphabetically
          tutors.sort((tut1, tut2) => tut1.label > tut2.label ? 1 : -1);
          // no default selection
          tutors.unshift({label: '', value: null});

          this.setState({
            registeredAppointments: newRegistrations,
            tutors: tutors,
            loading: false
          });
        } else {
          this.setState({showModal: true, error: res.data.msg, loading: false});
        }
      })
      .catch(err => {
        this.setState({showModal: true, error: err.message, loading: false});
      })
  }

  componentDidMount () {
    this.loadAppointments();
  }

  render() {
    let modalContent = <Spinner />;

    if (this.state.showRS) {
      modalContent = <RSInfo rsId={this.state.selectedRsId} />
    }

    if (this.state.error) {
      modalContent = <p style={{color: 'red'}}>Es ist ein Fehler aufgetreten: {this.state.error}</p>
    }

    if (this.state.success) {
      modalContent = <p style={{color: 'green'}}>{this.state.success}</p>
    }

    if (this.state.evalPayload) {
      modalContent = (
        <AuxComp>
          <p>Möchtest du einen Evaluationslink für die ausgewählte Beratung verschicken?</p>
          <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
            <div style={{width: '200px'}}>
              <Button buttonHandler={this.backdropClickHandler}>Zurück</Button>
            </div>
            <div style={{width: '200px'}}>
              <Button buttonHandler={this.confirmEvalHandler}>Evaluation senden</Button>
            </div>
          </div>
        </AuxComp>
      );
    }

    if (this.state.archivePayload) {
      if (this.props.role === 'librarian') {
        modalContent = (
          <AuxComp>
            <p>Bitte gib für statistische Zwecke an, ob die ratsuchende Person anwesend war und die Beratung wie geplant stattfinden konnte.</p>

            <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
              <div style={{width: '200px'}}>
                <Button buttonHandler={() => this.confirmArchiveHandlerWithoutProtocol(true)}>Stattgefunden</Button>
              </div>
              <div style={{width: '200px'}}>
                <Button buttonHandler={() => this.confirmArchiveHandlerWithoutProtocol(false)}>Nicht stattgefunden</Button>
              </div>
            </div>

            <p><em>Achtung: Durch die Archivierung werden die Kontaktdaten des*der Ratsuchenden unwiderruflich gelöscht, falls keine Folgeberatung besteht!</em></p>
          </AuxComp>
        );
      } else {
        modalContent = (
          <AuxComp>
            <p>Bist du sicher, dass du den ausgewählten Termin archivieren möchtest? Falls keine Folgeberatung existiert, werden dadurch die Kontaktinformationen der*des Ratsuchenden unwiderruflich gelöscht.</p>
            <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
              <div style={{width: '200px'}}>
                <Button buttonHandler={this.backdropClickHandler}>Zurück</Button>
              </div>
              <div style={{width: '200px'}}>
                <Button buttonHandler={this.confirmArchiveHandler}>Archivieren</Button>
              </div>
            </div>
          </AuxComp>
        );
      }
    }

    if (this.state.showDatePicker) {
      const ExampleCustomInput = ({ value, onClick }) => (
        <button style={{height:'40px', margin:'10px'}} onClick={onClick}>
          {value}
        </button>
      );
      modalContent = (
        <div style={{height: '50vh'}}>
          <p style={{textAlign: 'center'}}>Wähle Datum und Uhrzeit für eine Folgeberatung:</p>
          <div style={{display: 'flex', justifyContent: 'center'}}>
          <DatePicker
            selected={this.state.followUpDateTime}
            onChange={date => this.setState({followUpDateTime: date})}
            showTimeSelect
            locale="de"
            timeCaption="Uhrzeit"
            timeIntervals={60}
            timeFormat="HH:mm"
            dateFormat="dd.MM.yyyy"
            customInput={<ExampleCustomInput />} />
            <div style={{width: '200px'}}>
              <Button buttonHandler={this.saveFollowUpHandler}>Speichern</Button>
            </div>
          </div>
        </div>
      )
    }

    if (this.state.showSendConference) {
      modalContent = (
        <AuxComp>
        <Input
          inputtype="select"
          label="Auf wen möchtest du die Beratung übertragen?"
          options={this.state.tutors}
          onChange={event => this.setState({selectedTutorId: event.target.value})} />
        <Button buttonHandler={this.sendConferenceHandler}>Abschicken</Button>
        </AuxComp>
      );
    }

    if (this.state.showReserveRoom) {
      modalContent = (
        <>
          <p>Am ausgewählten Termin ist der Beratungsraum verfügbar. Möchtest du ihn reservieren?</p>
          <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}}>
            <div style={{width: '200px'}}>
              <Button buttonHandler={this.backdropClickHandler}>Abbrechen</Button>
            </div>
            <div style={{width: '200px'}}>
              <Button buttonHandler={this.confirmRoomReservation}>Reservieren</Button>
            </div>
          </div>
        </>
      );
    }

    return(
      <AuxComp>
        <Modal visible={this.state.showModal} onBackdropClick={this.backdropClickHandler}>
          {modalContent}
        </Modal>
        <h1 style={{textAlign: 'center'}}>Aktuelle Anmeldungen</h1>
        <h3>Verwalte hier registierte Schreibberatungen. Du kannst Informationen über Ratsuchende abrufen, Protokolle schreiben, Folgeberatungen vereinbaren und Termine archivieren*.</h3>
        {this.state.loading?
          <Spinner /> :
          <RegistrationsList
            registeredAppointments={this.state.registeredAppointments}
            ptRole={this.props.role}
            onIconClick={this.iconClickHandler} />
        }
        <p><em>*Sobald du ein Protokoll geschrieben hast bzw. eine Beratung bestätigt hast, kannst du Termine archivieren. Nach dem Archivieren wird der ausgewählte Termin hier nicht mehr angezeigt. Falls keine Folgeberatung besteht, werden außerdem die Kontaktdaten der Ratsuchenden aus unserer Datenbank gelöscht. Damit kommen wir ihren Datenschutzrechten nach, deshalb solltest du Archivierungen regelmäßig vornehmen. Geschriebene Protokolle kannst du weiterhin im Archiv einsehen und bearbeiten.</em></p>
      </AuxComp>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token,
    role: state.pt.role
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onViewProtocol: (protocolId) => dispatch({type:'SELECT_PROTOCOL', protocolId: protocolId}),
    onCreateProtocol: (terminId) => dispatch({type:'CREATE_PROTOCOL', terminId: terminId})
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Registrations));
