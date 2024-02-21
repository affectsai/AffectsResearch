/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useCallback} from "react";
import * as eva from '@eva-design/eva';
import {ApplicationProvider, BottomNavigation, BottomNavigationTab, Icon, IconRegistry} from '@ui-kitten/components';
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
import {ImageProps, SafeAreaView, StatusBar} from "react-native";
import {NavigationContainer} from "@react-navigation/native";


SplashScreen.preventAutoHideAsync().then(() => {});
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {HomeScreen} from "./homescreen.component";
import {BigFiveInventoryScreen} from "../features/personality/bigfiveinventory.component";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {LegalScreen} from "./legalscreen.component";

const { Navigator, Screen } = createBottomTabNavigator();
const HomeIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="home" />;
const SurveyIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="list" />;
const LegalIcon = (
    props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="info" />;
const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}>
        <BottomNavigationTab title='Home' icon={HomeIcon}/>
        <BottomNavigationTab title='Big 5 Inventory' icon={SurveyIcon}/>
        <BottomNavigationTab title='Legal' icon={LegalIcon}/>
    </BottomNavigation>
);

const TabNavigator = () => (
    <Navigator screenOptions={{ headerShown: false }} tabBar={props => <BottomTabBar {...props} />}>
        <Screen name='Home' component={HomeScreen}/>
        <Screen name='Big 5 Inventory' component={BigFiveInventoryScreen}/>
        <Screen name='Legal' component={LegalScreen}/>
    </Navigator>
);

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
                <GestureHandlerRootView style={{flex: 1}}>
                    <SafeAreaView style={{flex: 1}}>
                        <NavigationContainer onReady={onNavigationReady}>
                            <TabNavigator/>
                        </NavigationContainer>
                    </SafeAreaView>
                </GestureHandlerRootView>
            </ApplicationProvider>
        </>
    );
}
