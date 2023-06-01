const initialState = {
  name: '',
  firstName: '',
  email: '',
  password: '',
  offeredSlots: [],
  authLoading: false,
  authError: null,
  loggedIn: false,
  token: '',
  ptId: '',
  role: '',
  terminId: null,
  protocolId: null,
  datesWithAppointments: []
};

const ptReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SUBMIT_LOGIN':
      return {
        ...state,
        email: action.email,
        password: action.password,
        authLoading: true
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        loggedIn: true,
        token: action.token,
        authError: null,
        authLoading: false
      };
    case 'AUTH_FAIL':
      return {
        ...state,
        authError: action.error,
        authLoading: false
      }
    case 'LOADED_USER':
      return {
        ...state,
        ptId: action.ptId,
        firstName: action.firstName,
        role: action.role
      }
    case 'GET_RESERVED_DATES':
      return {
        ...state,
        datesWithAppointments: action.reservedDates
      };
    case 'SELECT_PROTOCOL':
      return {
        ...state,
        protocolId: action.protocolId
      };
    case 'CREATE_PROTOCOL':
      return {
        ...state,
        protocolId: null,
        terminId: action.terminId
      };
    case 'LOG_OUT':
      return {
        ...initialState
      }
    default:
      return state;
  }
};

export default ptReducer;
