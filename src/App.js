// App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import GooglePlaceAutocomplete from './components/GooglePlaceAutocomplete';


const App = () => {
  return (
    <Provider store={store}>
      <div>
        <h1>Google Place Autocomplete with Redux</h1>
        <GooglePlaceAutocomplete />
      </div>
    </Provider>
  );
};

export default App;
