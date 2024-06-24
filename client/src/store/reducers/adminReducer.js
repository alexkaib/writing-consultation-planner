const initialState = {
  selectedTutorInfo: null,
  selectedTypeId: 0
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_TUTOR':
      return {
        ...state,
        selectedTutorInfo: action.tutorInfo
      };
    case 'EDIT_TYPE':
      return {
        ...state,
        selectedTypeId: action.typeId
      };
    default:
      return state;
  }
};

export default adminReducer;
