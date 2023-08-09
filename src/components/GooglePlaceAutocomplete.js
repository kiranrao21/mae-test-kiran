import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlaceDetails } from '../actions/placesActions';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

const GooglePlaceAutocomplete = () => {
  const [address, setAddress] = useState('');
  const dispatch = useDispatch();
  const searches = useSelector((state) => state.places.searches);

  const handlePlaceSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      dispatch(fetchPlaceDetails(results[0].place_id));
    } catch (error) {
      console.error('Error selecting place:', error);
    }
  };

  const handleChange = (address) => {
    setAddress(address);
  };

  return (
    <LoadScript
      googleMapsApiKey= 'AIzaSyCk1hEl4OHzrckfolVXXKSTd8YT-903j94'
      libraries={['places']} // Add 'libraries' prop with 'places'
    >
      <div>
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handlePlaceSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Enter a place',
                })}
              />
              <div>
                {loading ? <div>Loading...</div> : null}
                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                  };
                  return (
                    <div
                      key={suggestion.placeId}
                      {...getSuggestionItemProps(suggestion, {
                        style,
                      })}
                    >
                      {suggestion.description}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <GoogleMap
          mapContainerStyle={{ height: '400px', width: '800px' }}
          center={{ lat: 0, lng: 0 }}
          zoom={2}
        >
          {searches.map((search, index) => (
            <Marker
              key={index}
              position={{
                lat: search.geometry.location.lat,
                lng: search.geometry.location.lng,
              }}
            />
          ))}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default GooglePlaceAutocomplete;
