import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-dates/axios-dates';

const consultationTypeDict = {
  student: "Fachübergreifend (Deutsch)",
  english_student: "Fachübergreifend (Englisch)",
  student_english: "Fachübergreifend (Englisch)",
  student_reading: "Leseberatung",
  germanistik: "Fachspezifisch (Germanistik)",
  ethnologie: "Fachspezifisch (Ethnologie)",
  phd: "Beratung für Promovierende (Deutsch)",
  english_phd: "Beratung für Promovierende (Englisch)",
  phd_english: "Beratung für Promovierende (Englisch)",
  textfeedback: "Schriftliches Textfeedback per E-Mail",
  research: "Rechercheberatung",
  methods: "Methodenberatung",
  go: "Orientierungsstudium"
};

const mediumDict = {
  both: 'Egal',
  digital: 'Online',
  analogue: 'In Präsenz'
};

class RSInfo extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    medium: "",
    angemeldetAls: "",
    semester: "",
    abschluss: "",
    fachbereich: "",
    fach: "",
    deutschAls: "",
    erstStudierend: true,
    terminReasons: "",
    genre: "",
    gender: "",
    reachedBy: "",
    comment: ""
  }

  componentDidMount () {
    const url = '/pt/my-tutee.php';
    const payload = {
      rsId: this.props.rsId,
      jwt: this.props.token
    };
    axios.post(url, payload)
      .then(res => {
        if (res.data.success === 1) {
          const rsInfo = res.data.rsInfo;
          const newRS = {
            firstName: rsInfo["firstName"],
            lastName: rsInfo["lastName"],
            email: rsInfo["email"],
            angemeldetAls: rsInfo["angemeldetAls"],
            semester: rsInfo["semester"],
            abschluss: rsInfo["abschluss"],
            fachbereich: rsInfo["fachbereich"],
            fach: rsInfo["fach"],
            deutschAls: rsInfo["deutschAls"],
            erstStudierend: rsInfo["erstStudierend"] === 1,
            terminReasons: rsInfo["terminReasons"],
            genre: rsInfo["genre"],
            gender: rsInfo["gender"],
            reachedBy: rsInfo["reachedBy"],
            comment: rsInfo["commentField"],
            otherReasons: rsInfo["otherTerminReasons"],
            topic: rsInfo["topic"]
          };
          if (!rsInfo["beratungsform"]) {
            newRS["medium"] = mediumDict[rsInfo.format];
          } else {
            newRS["medium"] = mediumDict[rsInfo.beratungsform];
          }
          this.setState(newRS);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  render () {
    const displayedInfo = [
      <li key='name'><strong>Name:</strong> {this.state.firstName} {this.state.lastName}</li>,
      <li key='email'><strong>E-Mail:</strong> {this.state.email}</li>,
      <li key='medium'><strong>Beratungsmedium:</strong> {this.state.medium}</li>,
      <li key='type'><strong>Beratungsform:</strong> {consultationTypeDict[this.state.angemeldetAls]}</li>,

      <li key='fachbereich'><strong>Fachbereich:</strong> {this.state.fachbereich}</li>,
      <li key='subject'><strong>Fach:</strong> {this.state.fach}</li>,
      <li key='semester'><strong>Semester:</strong> {this.state.semester}</li>,
    ];
    if (this.props.role === 'peertutor') {
      displayedInfo.push(
        <li key='reasons'><strong>Terminanlass:</strong> {this.state.terminReasons}</li>,
        <li key='genre'><strong>Textsorte:</strong> {this.state.genre}</li>,
        <li key='gender'><strong>Geschlecht:</strong> {this.state.gender}</li>,
        <li key='language'><strong>Deutsch ist:</strong> {this.state.deutschAls}</li>
      );
    }
    else if (this.props.role === 'methodTutor') {
      displayedInfo.push(
        <li key='reasons'><strong>Terminanlass:</strong> {this.state.terminReasons}</li>,
        <li key='genre'><strong>Sonstige Gründe:</strong> {this.state.otherReasons}</li>,
        <li key='language'><strong>Thema/Fragestellung</strong> {this.state.topic}</li>
      );
    }
    displayedInfo.push(
      <li key='comment'><strong>Kommentar:</strong> {this.state.comment}</li>
    );

    return (
      <div>
      <h2>Informationen zu Ratsuchenden</h2>
      <ul>
        {displayedInfo}
      </ul>
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return {
    loggedIn: state.pt.loggedIn,
    ptId: state.pt.ptId,
    token: state.pt.token,
    role: state.pt.role
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(RSInfo);
