// App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import GooglePlaceAutocomplete from './components/GooglePlaceAutocomplete';
import './styles/main.scss';


const App = () => {
  return (
    <Provider store={store}>
      <div className="section pt-1">
        <div className="wrap-2 centralized">
          <div className="flex-box gap-1">
            <h1>Google Place Autocomplete with Redux</h1>
            <GooglePlaceAutocomplete />
          </div>
        </div>
      </div>
    </Provider>
  );
};

export default App;
