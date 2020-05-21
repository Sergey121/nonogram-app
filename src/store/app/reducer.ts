import { Action } from '../../models/Action';

export type AppState = {
  rows: Array<Array<number>>;
  columns:  Array<Array<number>>;
};

const initialState: AppState = {
  rows: [
    [3],
    [1, 1],
    [1, 1, 1],
    [1, 1],
    [1, 1],
  ],
  columns: [
    [2, 1],
    [1, 1],
    [1, 1],
    [1, 1],
    [2, 1],
  ],
};

const app = (state: AppState = initialState, action: Action) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default app;
