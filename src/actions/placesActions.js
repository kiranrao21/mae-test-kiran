import { ADD_PLACE } from '../constants/types';

export const addPlace = (place) => ({
  type: ADD_PLACE,
  payload: place,
});

export const addSearch = (searched) => {
  return async (dispatch) => {
    try {
      dispatch(addPlace(searched));
    }
    catch (err) {
      console.error('err')
    }
  }
}