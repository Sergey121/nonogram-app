import { createStore, combineReducers } from 'redux';

import app, { AppState } from './app/reducer';

export type RootState = {
  app: AppState;
}

const rootReducer = combineReducers({
  app,
});

export default createStore(rootReducer);
