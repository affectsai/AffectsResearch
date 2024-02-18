/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from "react";
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry, Layout} from '@ui-kitten/components';
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
import {useDispatch, useSelector} from 'react-redux';

/*
 * screens
 */
import {AppNavigator} from './navigation.component';
import {useFonts} from "expo-font";
import {Animated, StatusBar} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import {RootStackParamList} from "./types";
import {HomeScreen} from "./homescreen.component";
import {DetailsScreen} from "./details.component";
import {NavigationContainer} from "@react-navigation/native";

SplashScreen.preventAutoHideAsync().then(() => {
    console.log('ok');
});

const {Navigator, Screen} = createStackNavigator<RootStackParamList>();


export function MainComponent(): React.JSX.Element | null {
    const [isAppReady, setAppReady] = useState(false);
    const theme: string = useSelector(state => state.theme);

    const [fontsLoaded, fontError] = useFonts({
        'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
        'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    });

    const onNavigationReady = useCallback(async () => {
        console.log('callback');
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
            setAppReady(true);
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    return (
        <>
            <StatusBar/>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider
                {...eva}
                theme={{...eva[theme], ...affectsai_theme}}
                customMapping={affectsai_mapping}>
                <NavigationContainer onReady={onNavigationReady}>
                    <Navigator screenOptions={{headerShown: false}}>
                        <Screen name="Home" component={HomeScreen}/>
                        <Screen name="Details" component={DetailsScreen}/>
                    </Navigator>
                </NavigationContainer>
            </ApplicationProvider>
        </>
    );
}
