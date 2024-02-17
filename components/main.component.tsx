/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';

/*
 * Branding...
 */
import {default as affectsai_theme} from '../affectsai-theme.json'; // <-- Import app theme
import {default as affectsai_mapping} from '../affectsai-theme-mapping.json'; // <-- Import app mapping

/*
 * Redux...
 */
import { useDispatch, useSelector } from 'react-redux';
import {ThemeContext} from './theme-context.tsx';

/*
 * screens
 */
import {AppNavigator} from './navigation.component';

export function MainComponent(): React.JSX.Element {
  const theme: string = useSelector(state => state.theme);
  const dispatch = useDispatch();

  const toggleTheme = () => {
    dispatch({type: 'TOGGLE_THEME'});
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <ApplicationProvider
          {...eva}
          theme={{...eva[theme], ...affectsai_theme}}
          customMapping={affectsai_mapping}>
          <AppNavigator />
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
}
