/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from "react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import {store,persistor} from './store';
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
