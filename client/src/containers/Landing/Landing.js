import React, {Component} from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import AuxComp from '../../hoc/AuxComp/AuxComp';
import ConsentForm from '../../components/ConsentForm/ConsentForm';

class Landing extends Component {

  acceptTermsHandler = () => {
    this.props.history.push({pathname: '/rs/select-type'});
  }

  componentDidMount () {
    if (this.props.termsAccepted) {
      this.props.history.push({pathname: '/rs/select-type'});
    }
  }

  render () {

    return (
      <AuxComp>
        <ConsentForm
          inputHandler={this.props.onCheck}
          accepted={this.props.termsAccepted}
          acceptTermsHandler={this.acceptTermsHandler}
          english={this.props.english} />
      </AuxComp>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    termsAccepted: state.rs.termsAccepted,
    english: state.rs.english
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onCheck: () => dispatch({type: 'CHECK_TERMS'})
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Landing));
