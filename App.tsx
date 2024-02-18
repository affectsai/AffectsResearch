/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useCallback } from "react";


/*
 * Redux...
 */
import { Provider } from 'react-redux';
import store from './store';

/*
 * screens
 */
import { MainComponent } from './components/main.component';
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AppLoading from "expo-app-loading";

SplashScreen.preventAutoHideAsync().then(()=>{console.log('ok');});


function App(): React.JSX.Element | null {
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    'Montserrat-Regular': require('./assets/fonts/Montserrat-Regular.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    console.log('callback');
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <AppLoading/>;
  }

  return (
    <>
      <Provider store={store}>
        <MainComponent />
      </Provider>
    </>
  );
}

export default App;
