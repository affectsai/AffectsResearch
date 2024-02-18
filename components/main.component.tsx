/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback } from "react";
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as SplashScreen from 'expo-splash-screen';

/*
 * Branding...
 */
import {default as affectsai_theme} from '../affectsai-theme.json'; // <-- Import app theme
import {default as affectsai_mapping} from '../affectsai-theme-mapping.json'; // <-- Import app mapping

/*
 * Redux...
 */
import { useDispatch, useSelector } from 'react-redux';

/*
 * screens
 */
import {AppNavigator} from './navigation.component';


export function MainComponent(): React.JSX.Element | null {
  const theme: string = useSelector(state => state.theme);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{...eva[theme], ...affectsai_theme}}
        customMapping={affectsai_mapping}>
        <AppNavigator />
      </ApplicationProvider>
    </>
  );
}
