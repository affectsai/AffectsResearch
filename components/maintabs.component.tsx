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

import React, {useCallback, useEffect, useState} from "react";
import * as eva from '@eva-design/eva';
import {ApplicationProvider, BottomNavigation, BottomNavigationTab, Icon, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import * as SplashScreen from 'expo-splash-screen';
import {default as affectsai_theme} from '../affectsai-theme.json'; // <-- Import app theme
import {default as affectsai_mapping} from '../affectsai-theme-mapping.json'; // <-- Import app mapping
import {selectTheme} from "../features/themes/themeSlice";
import {useDispatch, useSelector} from 'react-redux';
import {useFonts} from "expo-font";
import {ImageProps, SafeAreaView, StatusBar} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ParticipantIDScreen} from "./homescreen.component";
import {BigFiveInventoryScreen} from "./bigfiveinventory.component";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {LegalScreen} from "./legalscreen.component";
import {HomeIcon, SurveyIcon, LegalIcon, CuadsIcon} from "./icons";
import {IdState, selectIdentity, validateParticipantID} from "../features/identification/idSlice";
import {AppDispatch} from "../store";
import {SAMScreen} from "./cuads_tab.component";

SplashScreen.preventAutoHideAsync().then(() => {});

const {Navigator, Screen} = createBottomTabNavigator();

const BottomTabBar = ({navigation, state}) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Home' icon={HomeIcon}/>
        <BottomNavigationTab title='Big 5 Inventory' icon={SurveyIcon}/>
        <BottomNavigationTab title='CUADS' icon={CuadsIcon}/>
        <BottomNavigationTab title='Legal' icon={LegalIcon}/>
    </BottomNavigation>
);

const TabNavigator = () => (
    <Navigator screenOptions={{headerShown: false}} tabBar={props => <BottomTabBar {...props} />}>
        <Screen name='Home' component={ParticipantIDScreen}/>
        <Screen name='Big 5 Inventory' component={BigFiveInventoryScreen}/>
        <Screen name='CUADS' component={SAMScreen} />
        <Screen name='Legal' component={LegalScreen}/>
    </Navigator>
);


/**
 * MainComponent is the top-level element which defines the BottomTabBar.
 *
 * @constructor
 */
export function MainTabsComponent(): React.JSX.Element | null {
    const dispatch = useDispatch<AppDispatch>()
    const theme: string = useSelector(selectTheme)


    let identity = useSelector(selectIdentity);
    const [isLoggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        console.log('Attempting to login using identity: ' + identity)
        dispatch(validateParticipantID({
            participantId: identity,
            validation: identity
        } as IdState))
    }, [identity])

    return (
        <TabNavigator/>
    );
}
