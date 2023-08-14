// placesReducer.js
import { ADD_PLACE } from '../constants/types';

const initialState = {
  searches: [],
};

const placesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLACE:
      return {
        ...state,
        searches: [...state.searches, action.payload],
      };
    default:
      return state;
  }
};

export default placesReducer;
