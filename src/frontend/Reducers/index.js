import { RECEIVE_GROUP_NAME, 
         RECEIVE_CONFIG, 
         RECEIVE_SUBGROUPS, 
         DELETE_SUBGROUP, 
         RECEIVE_USERS, 
         UPDATE_USERS, 
         REMOVE_USER, 
         USER_AUTHENTICATION, 
         RECEIVE_AUTH,
         ADD_DUMMY_USER } from '../Constants';

import defaultUser from 'Assets/defaultUser';

const initialState = {
  authenticated: false,
  auth: { UWNetID: "", DisplayName: "" },
  groupName: "",
  config: {},
  subgroups: [],
  users: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_GROUP_NAME:
      return Object.assign({}, state, { groupName: action.groupName });
    case RECEIVE_CONFIG:
      return Object.assign({}, state, { config: action.config });
    case RECEIVE_SUBGROUPS:
      return Object.assign({}, state, { subgroups: action.subgroups });
    case DELETE_SUBGROUP:
      let subgroups = state.subgroups.filter(sg => sg.id !== action.subgroup);
      return Object.assign({}, state, {subgroups});
    case RECEIVE_USERS:
      return Object.assign({}, state, {users: action.users});
    case ADD_DUMMY_USER:
      let dummy = { identifier: action.identifier, Base64Image: defaultUser, DisplayName: "Loading..." };
      return Object.assign({}, state, { users: [dummy, ...state.users]});
    case UPDATE_USERS:
      let newUsers = state.users.map(u => {
        if(u.identifier && u.identifier === action.user.identifier) {
          delete action.user.identifier;
          return action.user;
        } else {
          return u;
        }
      });
      return Object.assign({}, state, {users: newUsers});
    case REMOVE_USER:
      let users = state.users.filter(u => u.UWNetID !== action.user);
      return Object.assign({}, state, {users});
    case USER_AUTHENTICATION:
      return Object.assign({}, state, {authenticated: action.authenticated});
    case RECEIVE_AUTH:
      return Object.assign({}, state, {auth: action.auth});
    default:
      return state;
  }
}