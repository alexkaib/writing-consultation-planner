import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from '../../../axios-dates/axios-dates';

import config from '../../../config.json';
import langStrings from '../../../lang/languageStrings.json';

import Modal from '../../../components/UI/Modal/Modal';
import Spinner from '../../../components/UI/Spinner/Spinner';
import FormDisplayer from '../../FormDisplayer/FormDisplayer';
import ConsentForm from '../../../components/ConsentForm/ConsentForm';
import SubmitFormButtons from '../../../components/RS/Submit/SubmitFormButtons/SubmitFormButtons';


class SlotSubmitter extends Component {
  constructor(props) {
    super(props);

    const initialRsInfo = {};

    config.registration_form.forEach(formElement => {
      if (formElement.type === 'heading') return;
      if (formElement.type === 'checkboxes') {
        const checkboxDict = {};
        formElement.options.forEach(option => {
          checkboxDict[option.value] = false;
        });
        initialRsInfo[formElement.db_name] = checkboxDict;
      } else if (formElement.type === 'select') {
        initialRsInfo[formElement.db_name] = formElement.options[0].value;
      } else {
        initialRsInfo[formElement.db_name] = null;
      }
    });

    this.state = {
      showModal: false,
      error: null,
      rsInfo: initialRsInfo,
      termsAccepted: false,
      invalidForm: false
    }
  }



  submitHandler = () => {
    const currentInfo = {...this.state.rsInfo};

    if (currentInfo.first_name < 1 || currentInfo.last_name < 1 || !(currentInfo.email.includes('@'))) {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0;
      this.setState({error: langStrings[this.props.language].error_form, showModal: true});
      return null;
    }
    else if (!this.state.termsAccepted) {
      this.setState({error: langStrings[this.props.language].error_privacy, showModal: true});
      return null;
    }
    else {
      this.setState({showModal: true});

      const formData = new FormData();

      const payload = {
        appointmentId: this.props.appointmentId,
        ptId: this.props.tutorId,
        consultationType: this.props.consultationType,
        date: this.props.selectedDate,
        time: this.props.selectedTime,
        format: this.props.selectedFormat,
        rsInfo: {}
      };
      // append files to form directly, put other form data into rsInfo property of payload
      for (const [key, value] of Object.entries(currentInfo)) {
        if (value instanceof FileList) {
          let totalFilesize = 0;
          for (const file of value) {
            totalFilesize += ((file.size/1024)/1024).toFixed(4); // MB
            formData.append(file.name, file);
          }
          if (totalFilesize > config.max_file_size) {
            this.setState({showModal: true, error: langStrings[this.props.language].error_file_size});
            return null;
          }
        } else {
          if (value === null) continue;
          payload.rsInfo[key] = value;
        }
      }

      formData.append("payload", JSON.stringify(payload));

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

  updateRsInfo = (newInfo) => {
    this.setState({rsInfo: newInfo});
  }

  termsCheckHandler = () => {
    const termsAccepted = this.state.termsAccepted;
    this.setState({termsAccepted: !termsAccepted});
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
    let modalContent = (
      <Spinner />
    );

    if (this.state.error) {
      modalContent = (
        <div>
        <p>{langStrings[this.props.language].registration_error}</p>
        <p>{langStrings[this.props.language].error_description}: {this.state.error}</p>
        </div>
      );
    }

    return (
      <>
        <Modal visible={this.state.showModal} onBackdropClick={this.backdropClickHandler}>
          {modalContent}
        </Modal>
        <FormDisplayer
          formStructure={config.registration_form}
          updateParentState={this.updateRsInfo}
          formInfo={this.state.rsInfo}
          goBackHandler={this.goBackHandler}
          submitHandler={this.submitHandler}/>

        <ConsentForm
          language={this.props.language}
          onTermsCheck={this.termsCheckHandler}
          termsAccepted={this.state.termsAccepted} />

        <SubmitFormButtons
          available={true}
          goBackHandler={this.goBackHandler}
          submitHandler={this.submitHandler}
          english={this.props.english} />
      </>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    tutorId: state.rs.selectedTutorId,
    appointmentId: state.rs.selectedSlotId,
    consultationType: state.rs.consultationType,
    selectedFormat: state.rs.selectedFormat,
    selectedDate: state.rs.selectedDate,
    selectedTime: state.rs.selectedTime,
    english: state.rs.english,
    language: state.rs.language
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SlotSubmitter));
