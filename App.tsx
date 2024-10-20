/* Copyright (C) 2024 Affects AI LLC - All Rights Reserved
 *
 * You may use, distribute and modify this code under the terms of
 * the CC BY-NC-SA 4.0 license.
 *
 * You should have received a copy of the CC BY-NC-SA 4.0 license
 * with this file. If not, please write to info@affects.ai or
 * visit:
 *    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 */

import React from "react";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import {store,persistor} from './store';
import { MainComponent } from './components/main.component';
import * as ScreenOrientation from 'expo-screen-orientation'

function App(): React.JSX.Element {
    ScreenOrientation.unlockAsync()
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
