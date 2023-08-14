// actions/placesActions.js
// import axios from 'axios';
import { ADD_PLACE } from '../constants/types';

export const addPlace = (place) => ({
  type: ADD_PLACE,
  payload: place,
});

// export const fetchPlaceDetails = (placeId) => {
//   return async (dispatch) => {
//     try {
//       const response = await axios.get(
//         `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=AIzaSyCk1hEl4OHzrckfolVXXKSTd8YT-903j94`
//       );

//       const place = response.data.result;
//       console.log('place: ', response)
//       dispatch(addPlace(place));
//     } catch (error) {
//       console.error('Error fetching place details:', error);
//     }
//   };
// };

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