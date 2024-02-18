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
import store from './store';

/*
 * screens
 */
import { MainComponent } from './components/main.component';

function App(): React.JSX.Element {
  return (
    <>
      <Provider store={store}>
        <MainComponent />
      </Provider>
    </>
  );
}

export default App;
