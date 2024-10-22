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

import React, {useCallback} from "react";
import * as eva from '@eva-design/eva';
import {ApplicationProvider, BottomNavigation, BottomNavigationTab, Icon, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as SplashScreen from 'expo-splash-screen';
import {default as affectsai_theme} from '../affectsai-theme.json'; // <-- Import app theme
import {default as affectsai_mapping} from '../affectsai-theme-mapping.json'; // <-- Import app mapping
import {selectTheme} from "../features/themes/themeSlice";
import {useSelector} from 'react-redux';
import {useFonts} from "expo-font";
import {SafeAreaView, StatusBar} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {createStackNavigator} from "@react-navigation/stack";
import {MainTabsComponent} from "./maintabs.component";
import {CuadsComponent} from "../features/cuads/cuads.component";

SplashScreen.preventAutoHideAsync().then(() => {});

const {Navigator, Screen} = createStackNavigator();

/**
 * MainComponent is the top-level element which defines the BottomTabBar.
 *
 * @constructor
 */
export function MainComponent(): React.JSX.Element | null {
    const theme: string = useSelector(selectTheme)
    const [fontsLoaded, fontError] = useFonts({
        'Montserrat-SemiBold': require('../assets/fonts/Montserrat-SemiBold.ttf'),
        'Montserrat-Bold': require('../assets/fonts/Montserrat-Bold.ttf'),
        'Montserrat-Regular': require('../assets/fonts/Montserrat-Regular.ttf'),
    });

    /*
     * Wait for fonts to load before hiding the splash screen...
     */
    const onNavigationReady = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return null;
    }

    const getTheme = (themeName: string) => {
        const themeMap = new Map<string, object>([
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
                <GestureHandlerRootView style={{flex: 1, height: '100%'}}>
                    <SafeAreaView style={{flex: 1, height: '100%'}}>
                        <NavigationContainer onReady={onNavigationReady}>
                            <Navigator screenOptions={{
                                headerShown: false
                            }}>
                                <Screen name='MainTabs' component={MainTabsComponent} />
                                <Screen name='CUADS' component={CuadsComponent} />
                            </Navigator>
                        </NavigationContainer>
                    </SafeAreaView>
                </GestureHandlerRootView>
            </ApplicationProvider>
        </>
    );
}
