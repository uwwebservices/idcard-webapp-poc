import { applyMiddleware, compose, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';

import loggerMiddleware from './middleware/logger';
import { rootReducer } from './reducers';

import initialState from './reducers/initialState';

export default function configureStore() {
  // Configure middleware
  let middlewares;
  if (process.env.NODE_ENV === 'development') {
    middlewares = [loggerMiddleware, thunkMiddleware];
  } else {
    middlewares = [thunkMiddleware];
  }
  const middlewareEnhancer = applyMiddleware(...middlewares);

  // Configure enhancers
  const enhancers = [middlewareEnhancer]
  const composedEnhancers = compose(...enhancers)

  // Setup persisted state
  if (!localStorage.getItem('reduxState')) {
    localStorage.setItem('reduxState', JSON.stringify(initialState));
  }
  const persistedState = JSON.parse(localStorage.getItem('reduxState'));

  // Create store
  const store = createStore(rootReducer, persistedState, composedEnhancers)

  // Reset some state
  store.subscribe(() => {
    let state = { ...store.getState() };
    state.users = initialState.users;
    state.loading = initialState.loading;
    state.subgroups = initialState.subgroups;
    localStorage.setItem('reduxState', JSON.stringify(state));
  });

  return store
};
