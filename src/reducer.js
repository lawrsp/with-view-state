import { combineReducers } from 'redux';
import { handleActionsWithLogout } from './utils';


const views = handleActionsWithLogout({
  'views/update': (state, action) => {
    const id = action.payload.id;
    return {
      ...state,
      [id]: {
        ...state[id],
        ...action.payload,
      },
    }
  },
  'views/delete': (state, action) => {
    const id = action.payload.id;
    const newState = {
      ...state,
    }

    delete newState[id];
    return newState;
  },
}, {})

export default views;
