const initialState = {
  termsAccepted: false,
  english: false,
  consultationType: '',
  availableSlots: [],
  selectedSlotAndTutor: '',
  selectedAppointmentId: '',
  selectedFormat: '',
  rsInfo: {
    firstName: '',
    lastName: '',
    email: '',
    semester: 1,
    abschluss: 'bachelor',
    fach: '',
    firstLanguage: '',
    secondLanguage: '',
    foreignLanguage: '',
    terminReasons: {
      ideenEntwickeln: false,
      unwohlBeimSchreiben: false,
      dozEmpfehlung: false,
      wissenschaftlichkeitLernen: false,
      feedback: false
    },
    otherTerminReason: '',
    reachedBy: {
      flyer: false,
      dozierende: false,
      socialMedia: false,
      ov: false,
      kommilitonen: false
    }
  }
};

const rsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CHECK_TERMS':
      return {
        ...state,
        termsAccepted: !state.termsAccepted
      };

    case 'SWITCH_LANG':
      return {
        ...state,
        english: !state.english
      };

    case 'SELECT_TYPE':
      return {
        ...state,
        consultationType: action.consultationType
      };

    case 'SELECT_SLOT':
      return {
        ...state,
        selectedSlotAndTutor: action.timeAndTutor,
        selectedAppointmentId: action.appointmentId,
        selectedFormat: action.selectedFormat
      };

    default:
      return state;
  }
}

export default rsReducer;
