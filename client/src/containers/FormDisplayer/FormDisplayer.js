import React, { Component } from 'react';
import { connect } from 'react-redux';

import Form from '../../components/UI/Form/Form';


class FormDisplayer extends Component {

  inputHandler = (event) => {
    const currentInfo = {...this.props.formInfo};
    switch (event.target.type) {
      case 'text':
      case 'email':
      case 'select-one':
        currentInfo[event.target.id] = event.target.value;
        break;

      case 'checkbox':
        const checkboxesName = event.target.parentElement.parentElement.id;
        const clickedBox = event.target.value;
        const updatedCheckboxes = currentInfo[checkboxesName];
        updatedCheckboxes[clickedBox] = !updatedCheckboxes[clickedBox];
        currentInfo[checkboxesName] = updatedCheckboxes;
        break;

      case 'file':
        currentInfo[event.target.id] = event.target.files;
        break;

      default:
        currentInfo[event.target.id] = event.target.value;
    }
    this.props.updateParentState(currentInfo);
  }

  render () {
    return (
      <>
        <Form
          formStructure={this.props.formStructure}
          currentInfo={this.props.formInfo}
          inputHandler={this.inputHandler}
          invalidForm={this.props.invalidForm}
          language={this.props.language} />
      </>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    language: state.rs.language,
    english: state.rs.english
  };
};

export default connect(mapStateToProps)(FormDisplayer);
