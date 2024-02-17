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
import {ThemeContext} from './components/theme-context.tsx';
import {default as affectsai_theme} from './affectsai-theme.json'; // <-- Import app theme
import {default as affectsai_mapping} from './affectsai-theme-mapping.json'; // <-- Import app mapping

/*
 * screens
 */
import {AppNavigator} from './components/navigation.component';

function App(): React.JSX.Element {
  const [theme, setTheme] = React.useState('light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
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

export default App;
