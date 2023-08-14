import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { addSearch } from '../actions/placesActions';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { List } from 'antd';

const GooglePlaceAutocomplete = () => {
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState({ lat: 3.1319197, lng: 101.6840589 }); // Default center
  const dispatch = useDispatch();
  const searches = useSelector((state) => state.places.searches);

  const handlePlaceSelect = async (address) => {
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      if(results.length > 0) {
        dispatch(addSearch({...latLng, address: results[0].formatted_address}));
        setAddress('');
      }
      
    } catch (error) {
      console.error('Error selecting place:', error);
    }
  };

  const handleChange = (newAddress) => {
    setAddress(newAddress);
  };

  useEffect(() => {
    if (map && searches.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      searches.forEach((search) => {
        if (search.lat && search.lng) {
          bounds.extend(new window.google.maps.LatLng(search.lat, search.lng));
        }
      });

      map.fitBounds(bounds);
    }
  }, [searches, map]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCk1hEl4OHzrckfolVXXKSTd8YT-903j94"
      libraries={['places']}
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
          center={center} // Set the center of the map
          zoom={10}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {searches.map((search, index) => {
            if (search.lat && search.lng) {
              return (
                <Marker
                  key={index}
                  position={{
                    lat: search.lat,
                    lng: search.lng,
                  }}
                />
              );
            }
            return null;
          })}
        </GoogleMap>
      </div>
      <List
            header={<div>History</div>}
            bordered
            dataSource={searches}
            renderItem={(item) => (
              <List.Item>
                 {item.address}
              </List.Item>
            )}
            >
      </List>
    </LoadScript>
  );
};

export default GooglePlaceAutocomplete;
