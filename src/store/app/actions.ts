import { Action } from '../../models/Action';
import { APP_CONSTANTS } from './constants';

export const AppActions = {
  setRunning: (value: boolean): Action<boolean> => {
    return {
      type: APP_CONSTANTS.SET_RUNNING,
      payload: value,
    };
  }
};
