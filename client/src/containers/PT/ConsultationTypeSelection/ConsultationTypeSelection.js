import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

import FormSelector from '../../../components/UI/FormSelector/FormSelector';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';


class ConsultationTypeSelection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      formError: null,
      selectedTime: {
          from: null,
          to: null
      },
      consultationTypes: [],
      typeCheckboxes: {},
      formatCheckboxes: {
        digital: false,
        analogue: false
      }
    }
  }

  timeSetHandler = event => {
    const newTime = {...this.state.selectedTime};
    newTime[event.target.id] = event.target.value;
    this.setState({selectedTime: newTime});
  }

  typeSelectHandler = event => {
    const clickedBox = event.target.value;
    const currentTypes = [...this.state.consultationTypes];
    const clickedTypeIndex = currentTypes.findIndex(type => type.id === clickedBox);
    currentTypes[clickedTypeIndex].selected = !currentTypes[clickedTypeIndex].selected;
    this.setState({consultationTypes: currentTypes});
  }

  formCheckHandler = event => {
    const whichCheckboxes = event.target.parentElement.parentElement.id;
    const currentState = {...this.state};
    const clickedBox = event.target.value;
    currentState[whichCheckboxes][clickedBox] = !currentState[whichCheckboxes][clickedBox];
    this.setState({currentState});
  }

  submissionHandler = () => {
    // validate time set
    if (this.state.selectedTime.from === null || this.state.selectedTime.to === null) {
      this.setState({
        formError: 'Bitte wähle eine Uhrzeit aus.'
      });
      return null;
    }
    // see if at least one type and format has been selected, error otherwise
    const hasType = this.state.consultationTypes.reduce(
      (acc, type) => type.selected || acc,
      false
    );
    if (!hasType) {
      this.setState({
        formError: 'Bitte wähle mindestens eine Beratungsform aus.'
      })
      return null;
    }
    const hasFormat = Object.values(this.state.formatCheckboxes).reduce(
      (acc, val) => val || acc
    );
    if (!hasFormat) {
      this.setState({
        formError: 'Bitte wähle Online und/oder Präsenz aus.'
      })
      return null;
    }
    // build an object of the form {fromTime: int, toTime: int, typeId: int, digital: bool, analogue: bool}
    const appointmentInfo = {
      fromTime: this.state.selectedTime.from,
      toTime: this.state.selectedTime.to,
      selectedTypeIds: this.state.consultationTypes.filter(type => type.selected).map(type => type.id),
      digital: this.state.formatCheckboxes.digital,
      analogue: this.state.formatCheckboxes.analogue
    }

    this.props.onTypeConfirm(appointmentInfo);
  }

  componentDidMount () {
    axios.get('/rs/available-types.php')
      .then(res => {
        const types = res.data.types.map(type => ({
          id: type.id,
          audience: type.audience,
          label: {
            'en': type.name_en,
            'de': type.name_de
          },
          selected: false
        }));
        this.setState({consultationTypes: types, loading: false});
      })
      .catch(err => {
        console.log(err.message);
      })
  }

  render () {
    if (this.state.loading) {
      return <Spinner />;
    }
    return (
      <>
      <p style={ {color: 'red'} }>{this.state.formError}</p>
      <p>{this.props.message}</p>
      <FormSelector
        selectedTime={this.state.timeInput}
        selectedTypes={this.state.typeCheckboxes}
        consultationTypes={this.state.consultationTypes}
        typeSelectHandler={this.typeSelectHandler}
        selectedFormat={this.state.formatCheckboxes}
        onFormCheck={this.formCheckHandler}
        onTimeSet={this.timeSetHandler}
        ptRole={this.props.role}
        language={this.props.language} />
      <div style={ {display:'flex', justifyContent:'center', flexWrap: 'wrap'} }>
      <Button buttonHandler={this.props.onModalClose}>Abbrechen</Button>
      <Button buttonHandler={this.submissionHandler}>{this.props.buttonText}</Button>
      </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.pt.role,
    language: state.rs.language
  };
};

export default connect(mapStateToProps)(ConsultationTypeSelection);
