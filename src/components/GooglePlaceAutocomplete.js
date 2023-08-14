import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useDispatch, useSelector } from 'react-redux';
import { addSearch } from '../actions/placesActions';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import { Input, List } from 'antd';

const GooglePlaceAutocomplete = () => {
  const [map, setMap] = useState(null);
  const [address, setAddress] = useState('');
  const [center] = useState({ lat: 3.1319197, lng: 101.6840589 }); // Default center
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

      const padding = 50;
      map.fitBounds(bounds, {padding});
    }
  }, [searches, map]);

  return (
    <LoadScript
      googleMapsApiKey={`${process.env.REACT_APP_KEY}`}
      libraries={['places']}
    >
      <div className='main-wrapper'>
        <PlacesAutocomplete
          value={address}
          onChange={handleChange}
          onSelect={handlePlaceSelect}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <Input
                {...getInputProps({
                  placeholder: 'Enter a place',
                })}>
                  </Input>
                  {loading ? <div>Loading...</div> : null}
              <div>
                <List
                  size="small"
                  bordered
                >
                {suggestions.map((suggestion) => {
                  const style = {
                    backgroundColor: suggestion.active ? '#41b6e6' : '#fff',
                  };
                  return (
                    <List.Item
                      key={suggestion.placeId}
                      {...getSuggestionItemProps(suggestion, {
                        style,
                      })}
                    >
                      {suggestion.description}
                    </List.Item>
                  );
                })}
                </List>
              </div>
            </div>
          )}
        </PlacesAutocomplete>

        <div className="map">
        <GoogleMap
          mapContainerStyle={{ height: '400px', width: '100%' }}
          center={center}
          zoom={5}
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

      </div>
      <div className='history-sec'>
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
      </div>
    </LoadScript>
  );
};

export default GooglePlaceAutocomplete;
