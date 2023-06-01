//h1: Archiv
//h2: Protokoll-Suche: freitext-suche & nach RS-Parametern (fachbereich, genre)
//h2: Semester-Buttons: onClick -> alle Protokolle des Semesters
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';
import { withRouter } from "react-router-dom";

import ProtocolSearch from '../../../components/PT/Archive/ProtocolSearch/ProtocolSearch';
import ResultDisplayer from '../../../components/PT/Archive/ResultDisplayer/ResultDisplayer';
import RSInfo from '../RSInfo/RSInfo';
import Modal from '../../../components/UI/Modal/Modal';
import AuxComp from '../../../hoc/AuxComp/AuxComp';

class Archive extends Component {
  state = {
    showModal: false,
    showResults: false,
    searchLoading: false,
    loadedProtocols: null,
    selectedRsId: null,
    showRS: false,
    error: null,
    searchParams: {
      searchTerm: '',
      fachbereich: 'na',
      genre: 'na'
    }
  }

  inputHandler = (event) => {
    const currentParams = {...this.state.searchParams};

    switch (event.target.type) {
      case 'text':
      case 'email':
      case 'select-one':
        currentParams[event.target.id] = event.target.value;
        console.log(event.target)
        this.setState({
          searchParams: currentParams
        });
        break;

      case 'checkbox':
        const checkboxesName = event.target.parentElement.parentElement.id;
        const clickedBox = event.target.value;
        const updatedCheckboxes = currentParams[checkboxesName];
        updatedCheckboxes[clickedBox] = !updatedCheckboxes[clickedBox];
        currentParams[checkboxesName] = updatedCheckboxes;
        this.setState({
          searchParams: currentParams
        });
        break;

      default:
      currentParams[event.target.id] = event.target.value;
      this.setState({
        searchParams: currentParams
      });
    }
  };

  submitSearchHandler = e => {
    e.preventDefault();
    const payload = {...this.state.searchParams, jwt: this.props.token}

    this.setState({showResults: true, searchLoading: true}, () => {
      axios.post('/pt/get-protocols.php', payload)
        .then(res => {
          if (res.data.success === 1) {
            this.setState({
              searchLoading: false,
              loadedProtocols: res.data.appointments
            });
          } else {
            this.setState({
              searchLoading: false,
              showResults: false,
              showModal: true,
              error: res.data.msg
            });
          }
        })
        .catch(err => {
          this.setState({
            searchLoading: false,
            showResults: false,
            showModal: true,
            error: "Beim Durchsuchen der Protokolle ist ein Serverfehler aufgetreten."
          });
        })
    });
  }

  //depending on type, id can be either terminId, protocolId, followUpId or a tuple of (terminId, rsId)
  iconClickHandler = (id, type) => {
    switch (type) {
      case 'rsInfo':
        this.setState({selectedRsId: id, showModal: true, showRS: true});
        break;

      case 'viewProtocol':
        this.props.onViewProtocol(id);
        this.props.history.push('/pt/protocol');
        break;

      case 'downloadProtocol':
        this.downloadHandler(id);
        break;

      case 'share':
        //future update: create link by sending request, on server-side create jwt, append to url, give url to user
        break;

      default:
        break;
    }
  }

  downloadHandler = id => {
    const payload = {
      protocolId: id,
      jwt: this.props.token
    };

    axios.post('/pt/download-protocol.php', payload,
      {
          responseType: 'arraybuffer',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/pdf'
          }
      })
    .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Protokoll.pdf'); //or any other extension
            document.body.appendChild(link);
            link.click();
        })
    .catch(err => {
      console.log(err)
    })

  }

  backdropClickHandler = () => {
    this.setState({showRS: false, showModal: false, error: null});
  }

  render () {
    let modalContent = null;

    if (this.state.showRS) {
      modalContent = <RSInfo rsId={this.state.selectedRsId} />
    }

    if (this.state.error) {
      modalContent = <p style={{color: 'red'}}>{this.state.error}</p>
    }

    return (
      <AuxComp>
        <Modal visible={this.state.showModal} onBackdropClick={this.backdropClickHandler}>
          {modalContent}
        </Modal>
        <h1 style={{textAlign: 'center'}}>Archiv</h1>
        <ProtocolSearch
          searchParams={this.state.searchParams}
          inputHandler={this.inputHandler}
          submitSearchHandler={this.submitSearchHandler}
          english={this.props.english}/>
        {this.state.showResults ?
          <ResultDisplayer
            searchLoading={this.state.searchLoading}
            loadedProtocols={this.state.loadedProtocols}
            onIconClick={this.iconClickHandler} /> :
          null
        }
      </AuxComp>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token,
    english: state.rs.english
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onViewProtocol: (protocolId) => dispatch({type:'SELECT_PROTOCOL', protocolId: protocolId})
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Archive));
