const initialState = {
  english: false,
  language: 'de',
  consultationType: '',
  availableSlots: [],
  selectedSlotId: '',
  selectedTutorId: '',
  selectedFormat: '',
  selectedDate: '',
  selectedTime: ''
};

const rsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SWITCH_LANG':
      return {
        ...state,
        english: !state.english,
        language: state.language === 'de' ? 'en' : 'de'
      };

    case 'SELECT_TYPE':
      return {
        ...state,
        consultationType: action.consultationType
      };

    case 'SELECT_SLOT':
      return {
        ...state,
        selectedSlotId: action.slotId,
        selectedTutorId: action.tutorId,
        selectedFormat: action.format,
        selectedDate: action.date,
        selectedTime: action.time
      };

    default:
      return state;
  }
}

export default rsReducer;
