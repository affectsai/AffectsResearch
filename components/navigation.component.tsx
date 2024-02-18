import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen} from './homescreen.component.tsx';
import {DetailsScreen} from './details.component.tsx';
import {RootStackParamList} from './types.tsx';
import {StatusBar} from "react-native";

const {Navigator, Screen} = createStackNavigator<RootStackParamList>();

const HomeNavigator = () => (
  <Navigator screenOptions={{headerShown: false}}>
    <Screen name="Home" component={HomeScreen} />
    <Screen name="Details" component={DetailsScreen} />
  </Navigator>
);

export const AppNavigator = () => (
  <NavigationContainer>
      <StatusBar/>

      <HomeNavigator />
  </NavigationContainer>
);
