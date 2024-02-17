/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StyleSheet, ImageProps} from 'react-native';

import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Layout,
  Text,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

/*
 * Branding...
 */
import {default as theme} from './affectsai-theme.json'; // <-- Import app theme
import {default as mapping} from './affectsai-theme-mapping.json'; // <-- Import app mapping

/*
 * screens
 */
import {AppNavigator} from './components/navigation.component';

function App(): React.JSX.Element {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{...eva.light, ...theme}}
        customMapping={mapping}>
        <AppNavigator />
      </ApplicationProvider>
    </>
  );
}

export default App;
