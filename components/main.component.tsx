/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from "react";
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as SplashScreen from 'expo-splash-screen';

/*
 * Branding...
 */
import {default as affectsai_theme} from '../affectsai-theme.json'; // <-- Import app theme
import {default as affectsai_mapping} from '../affectsai-theme-mapping.json'; // <-- Import app mapping
import {selectTheme} from "../features/themes/themeSlice";
/*
 * Redux...
 */
import {useSelector} from 'react-redux';

/*
 * screens
 */
import {useFonts} from "expo-font";
import {StatusBar} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {HomeNavigator} from "./navigation.component";

SplashScreen.preventAutoHideAsync().then(() => {});

export function MainComponent(): React.JSX.Element | null {
    const theme: string = useSelector(selectTheme)
    const [fontsLoaded, fontError] = useFonts({
        'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
        'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
        'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    });

    const onNavigationReady = useCallback(async () => {
        console.log('callback');
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const getTheme = (themeName: string) => {
        const themeMap = new Map<string,object>([
            ['light', eva.light],
            ['dark', eva.dark],
        ])

        return themeMap.get(themeName);
    }

    return (
        <>
            <StatusBar/>
            <IconRegistry icons={EvaIconsPack}/>
            <ApplicationProvider
                {...eva}
                theme={{...getTheme(theme), ...affectsai_theme}}
                customMapping={affectsai_mapping}>
                <NavigationContainer onReady={onNavigationReady}>
                    <HomeNavigator/>
                </NavigationContainer>
            </ApplicationProvider>
        </>
    );
}
