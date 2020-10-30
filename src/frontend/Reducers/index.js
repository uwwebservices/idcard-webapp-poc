import * as types from '../actions/actionTypes';
import defaultUser from 'Assets/defaultUser';

export const initialState = {
  authenticated: null,
  iaaAuth: null,
  iaacheck: '',
  groupName: '',
  subgroups: [],
  users: [],
  loading: { users: false, subgroups: false },
  registrationToken: false,
  privGrpVis: true,
  privGrpVisTimeout: 5,
  netidAllowed: false,
  tokenTTL: 180,
  confidential: false,
  notifications: []
};

export const RootReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.RECEIVE_GROUP_NAME:
      return { ...state, groupName: action.groupName };
    case types.LOADING_SUBGROUPS:
      return { ...state, loading: { ...state.loading, subgroups: true } };
    case types.RECEIVE_SUBGROUPS:
      return { ...state, subgroups: action.subgroups, loading: { ...state.loading, subgroups: false } };
    case types.DELETE_SUBGROUP:
      let subgroups = state.subgroups.filter(sg => sg.name !== action.subgroup);
      return { ...state, subgroups };
    case types.LOADING_USERS:
      return { ...state, loading: { ...state.loading, users: true } };
    case types.RECEIVE_USERS:
    case types.CLEAR_USERS:
      return { ...state, users: action.users, loading: { ...state.loading, users: false } };
    case types.ADD_DUMMY_USER:
      return { ...state, users: [{ displayId: action.displayId, UWRegID: action.displayId, Base64Image: defaultUser, loading: true }, ...state.users] };
    case types.FAILED_DUMMY_USER:
      return { ...state, users: state.users.filter(u => u.displayId !== action.displayId) };
    case types.UPDATE_USERS:
      let newUsers = state.users.map(u => {
        return u.displayId && u.displayId === action.user.displayId ? action.user : u;
      });
      return { ...state, users: newUsers };
    case types.MARK_USER_FOR_DELETION:
      let users = state.users.map(u => {
        if (u.UWNetID === action.identifier) {
          u.deleting = true;
        }
        return u;
      });
      return { ...state, users };
    case types.REMOVE_USER:
      return { ...state, users: state.users.filter(u => u.UWNetID !== action.user) };
    case types.USER_AUTHENTICATION:
      return { ...state, authenticated: action.authenticated, iaaAuth: action.iaaAuth, iaacheck: action.iaacheck };
    case types.STORE_REGISTRATION_TOKEN:
      return { ...state, registrationToken: action.token };
    case types.STORE_PRIVATE_GROUP_VISIBILITY:
      return { ...state, privGrpVis: action.enabled };
    case types.STORE_PRIVATE_GROUP_VISIBILITY_TIMEOUT:
      return { ...state, privGrpVisTimeout: action.timeout };
    case types.STORE_NETID_ALLOWED:
      return { ...state, netidAllowed: action.netidAllowed };
    case types.STORE_TOKEN_TTL:
      return { ...state, tokenTTL: action.tokenTTL };
    case types.ADD_NOTIFICATION:
      return { ...state, notifications: [...state.notifications, action.notification] };
    case types.REMOVE_NOTIFICATION:
      return { ...state, notifications: state.notifications.filter(n => n.messageId != action.messageId) };
    case types.PRIVATE_GROUP:
      return { ...state, confidential: action.confidential };
    case types.RESET_STATE:
      return initialState;
    case types.STORE_SETTINGS:
      return { ...state, ...action.settings };
    default:
      return state;
  }
};
