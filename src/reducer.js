import { UPDATE, DELETE } from './actions';

const views = (state = {}, action) => {
  switch (action.type) {
    case UPDATE: {
      const id = action.meta.id;
      return {
        ...state,
        [id]: {
          ...state[id],
          ...action.payload
        }
      };
    }
    case DELETE: {
      const id = action.meta.id;
      const newState = {
        ...state
      };

      delete newState[id];
      return newState;
    }
    default:
      return state;
  }
};

export default views;

