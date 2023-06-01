import React, { Component } from 'react';
import { connect } from 'react-redux';

import FormSelector from '../../../components/UI/FormSelector/FormSelector';
import Button from '../../../components/UI/Button/Button';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

class ConsultationTypeSelection extends Component {
  state = {
    formError: null,
    typeCheckboxes: {
      student: false,
      student_english: false,
      student_reading: false,
      textfeedback: false,
      discipline_specific: false,
      phd: false,
      phd_english: false,
      research: false,
      methods: false
    },
    formatCheckboxes: {
      digital: false,
      analogue: false
    }
  }

  formCheckHandler = event => {
    const whichCheckboxes = event.target.parentElement.parentElement.id;
    const currentState = {...this.state};
    const clickedBox = event.target.value;
    currentState[whichCheckboxes][clickedBox] = !currentState[whichCheckboxes][clickedBox];
    this.setState({currentState});
  }

  submissionHandler = () => {
    // see if at least one type and format has been selected, error otherwise
    const hasType = Object.values(this.state.typeCheckboxes).reduce(
      (val, acc) => val || acc
    );
    if (!hasType) {
      this.setState({
        formError: 'Bitte wähle mindestens eine Beratungsform aus.'
      })
      return null;
    }
    const hasFormat = Object.values(this.state.formatCheckboxes).reduce(
      (val, acc) => val || acc
    );
    if (!hasFormat) {
      this.setState({
        formError: 'Bitte wähle Online und/oder Präsenz aus.'
      })
      return null;
    }
    // combine type and format into one list (corresponds to db table 'beratungsformen')
    const consultationTypes = [];
    if (this.state.formatCheckboxes.analogue) {
      for (const [type, checked] of Object.entries(this.state.typeCheckboxes)) {
        if (checked) {
          consultationTypes.push(type + '_analogue');
        }
      }
    }
    if (this.state.formatCheckboxes.digital){
      for (const [type, checked] of Object.entries(this.state.typeCheckboxes)) {
        if (checked) {
          consultationTypes.push(type + '_digital');
        }
      }
    }
    this.props.onTypeConfirm(consultationTypes);
  }

  render () {
    return (
      <AuxComp>
      <p style={ {color: 'red'} }>{this.state.formError}</p>
      <p>{this.props.message}</p>
      <FormSelector
        selectedTypes={this.state.typeCheckboxes}
        selectedFormat={this.state.formatCheckboxes}
        onFormCheck={this.formCheckHandler}
        ptRole={this.props.role} />
      <div style={ {display:'flex', justifyContent:'center'} }>
      <Button buttonHandler={this.props.onModalClose}>Abbrechen</Button>
      <Button buttonHandler={this.submissionHandler}>{this.props.buttonText}</Button>
      </div>
      </AuxComp>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    role: state.pt.role
  };
};

export default connect(mapStateToProps)(ConsultationTypeSelection);
