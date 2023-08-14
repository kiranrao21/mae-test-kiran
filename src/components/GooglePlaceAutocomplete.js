import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';

import React, { useState, useEffect  } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { addSearch } from '../actions/placesActions';

  const GooglePlaceAutocomplete = () => {

  const [map, setMap] = useState(null); // State to store GoogleMap instance
  const [address, setAddress] = useState('');
  const dispatch = useDispatch();
  const searches = useSelector((state) => state.places.searches);

  const handlePlaceSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      dispatch(addSearch(latLng));
    } catch (error) {
      console.error('Error selecting place:', error);
    }
  };

  const handleChange = (address) => {
    setAddress(address);
  };

    // Calculate center and zoom for the map
    useEffect(() => {
      if (map && searches.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();
        searches.forEach((search) => {
          if (search.geometry && search.geometry.location) {
            const { lat, lng } = search.geometry.location;
            bounds.extend(new window.google.maps.LatLng(lat, lng));
          }
        });
  
        map.fitBounds(bounds);
      }
    }, [searches, map]);

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
          center={{ lat: 3.1319197, lng: 101.6840589 }}
          zoom={10}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {searches.map((search, index) => {
            console.log('search.lat: ',search.lat)
            console.log('search.lng: ',search.lng)
              return (
                <Marker
                  key={index}
                  position={{
                    lat: search.lat,
                    lng: search.lng,
                  }}
                />
              );
          })}
        </GoogleMap>
      </div>
      <div>
          History
          <ul>
            {
              searches.map((search,index)=>{return (<li>{search.lat},{search.lng}</li>)})
            }
            <li></li>
          </ul>
      </div>
    </LoadScript>
  );
};

export default GooglePlaceAutocomplete;
