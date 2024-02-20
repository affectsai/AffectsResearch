import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './homescreen.component';
import {DetailsScreen} from './details.component';
import {RootStackParamList} from './types';
import {BigFiveInventoryScreen} from "./bigfiveinventory.component";
import {BottomTabBar, createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const {Navigator, Screen} = createStackNavigator<RootStackParamList>();

// const {Navigator, Screen} = createBottomTabNavigator()

export const HomeNavigator = () => (
  <Navigator screenOptions={{headerShown: false}}>
      <Screen name="Home" component={HomeScreen} />
      <Screen name="Details" component={DetailsScreen} />
      <Screen name="BigFive" component={BigFiveInventoryScreen} />
  </Navigator>
);

// export const HomeNavigator = () => (
//     <Navigator tabBar={props => <BottomTabBar {...props} />}>
//         <Screen name="Home" component={HomeScreen} />
//         <Screen name="Details" component={DetailsScreen} />
//         <Screen name="BigFive" component={BigFiveInventoryScreen} />
//     </Navigator>
// );
export const AppNavigator = () => (
    <GestureHandlerRootView style={{flex: 1}}>
        <NavigationContainer>
            <HomeNavigator />
        </NavigationContainer>
    </GestureHandlerRootView>
);
