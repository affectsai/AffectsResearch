/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";


/*
 * Redux...
 */
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import {store, persistor} from './store';
/*
 * screens
 */
import { MainComponent } from './components/main.component';

function App(): React.JSX.Element {
  return (
    <>
      <Provider store={store}>
          <PersistGate persistor={persistor}>
            <MainComponent />
          </PersistGate>
      </Provider>
    </>
  );
}

export default App;
