import { Action } from '../../models/Action';

export type AppState = {};

const initialState = {};

const app = (state: AppState = initialState, action: Action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default app;
