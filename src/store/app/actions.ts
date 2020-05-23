import { Action } from '../../models/Action';
import { APP_CONSTANTS } from './constants';
import { Option } from '../../models/Option';

export const AppActions = {
  setRunning: (value: boolean): Action<boolean> => {
    return {
      type: APP_CONSTANTS.SET_RUNNING,
      payload: value,
    };
  },
  changeOption: (option: Option): Action<Option> => {
    return {
      type: APP_CONSTANTS.CHANGE_OPTION,
      payload: option,
    };
  },
};
