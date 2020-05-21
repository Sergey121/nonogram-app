import { Action } from '../../models/Action';

export type AppState = {
  rows: Array<Array<number>>;
  columns: Array<Array<number>>;
};

const Bunny = {
  rows: [
    [5, 5],
    [3, 1, 2],
    [1, 5, 2],
    [1, 4, 5, 1],
    [8, 4, 1],
    [3, 4, 1],
    [2, 3, 1],
    [2, 3, 1],
    [3, 2, 1],
    [1, 2],
    [7, 1],
    [1, 1, 1, 2],
    [1, 1, 1, 1, 1, 1],
    [1, 2, 1, 1, 1],
    [2, 8, 1],
    [4, 4, 1, 4],
    [1, 1, 1, 1, 1],
    [3, 3, 1, 3],
    [1, 2, 1, 1, 1, 2],
    [1, 3, 1, 6, 1],
  ],
  columns: [
    [2],
    [2, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 2, 3, 1],
    [1, 2, 2, 2],
    [1, 2, 2, 2],
    [1, 3, 3, 1, 1],
    [1, 2, 1, 2, 2],
    [1, 6, 1, 2, 1],
    [2, 3, 1, 6],
    [1, 2, 1, 6, 1],
    [1, 4, 1, 1, 2],
    [1, 7, 1, 1, 1, 1, 1],
    [1, 7, 1, 1, 1],
    [2, 5, 2, 2, 1, 1],
    [2, 1, 1, 1],
    [10, 1, 2],
    [3, 1, 2],
    [4, 1],
    [1, 1],
  ],
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
