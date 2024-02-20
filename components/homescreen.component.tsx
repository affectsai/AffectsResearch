import React, {useEffect, useState} from 'react';
import {
  Button,
  Icon,
  Layout,
  Divider,
  TopNavigation,
} from '@ui-kitten/components';
import {SafeAreaView, ImageProps, StyleSheet, StatusBar} from 'react-native';
import {styles, HomeScreenNavigationProp} from './types';
import {useDispatch, useSelector} from "react-redux";
import {toggleTheme} from "../features/themes/themeSlice";
import axios from 'axios'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';

import { feathers } from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import authentication from '@feathersjs/authentication-client'
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  logout,
  selectAuthToken,
  storeToken,
  storeTokenActionPayload
} from "../features/authentication/authenticationSlice";
import {
  authenticatedServiceCall,
  AuthSuccessCallbackURL,
  feathersApp,
  feathersClient,
  reauthenticate
} from "../features/authentication/authentication.js"

const HeartIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="heart" />;

export function HomeScreen({
  navigation,
}: HomeScreenNavigationProp): React.JSX.Element {
  const authToken = useSelector(selectAuthToken);

  const navigateDetails = () => {
    navigation.navigate('Details');
  };
  const navigateBigFive = () => {
    navigation.navigate('BigFive');
  };
  const dispatch = useDispatch();

  const queryUsersAsync = async () => {
    await authenticatedServiceCall( () => {
      feathersApp.service("users").find().then((r) => {
        console.log(JSON.stringify(r))
      }).catch((e) => {
        console.log(e)
      })
    })
  }

  const authAsync = async () => {
    if (feathersApp.authentication.authenticated) {
      console.log("Already logged in...");
      return;
    }

    if (authToken) {
      console.log("Already have auth token, attempting reauthorization.");
      await reauthenticate(authToken).then(() => {
        if (feathersApp.authentication.authenticated)
          console.log("Successfully reauthenticated the existing access token.");
        else
          dispatch(logout())
      })
    }

    if (!feathersApp.authentication.authenticated)
      await WebBrowser.openAuthSessionAsync(`https://api.affects.ai/oauth/google?redirect=${AuthSuccessCallbackURL}`);
  }

  const logoutAsync = async() => {
    dispatch(logout());
    await feathersApp.authentication.logout();
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <TopNavigation title="Affects Research" alignment="center" />
      <Divider />
      <Layout style={styles.container}>
        <Button
            style={styles.button}
            onPress={()=>authAsync()}
            accessoryLeft={HeartIcon}>
          Login
        </Button>
        <Button
            style={styles.button}
            onPress={()=>logoutAsync()}
            accessoryLeft={HeartIcon}>
          Logout
        </Button>
        <Button
            style={styles.button}
            onPress={()=>queryUsersAsync()}
            accessoryLeft={HeartIcon}>
          Query
        </Button>
        <Button style={styles.button} onPress={() => dispatch(toggleTheme())}>
          Switch Theme
        </Button>
        <Button style={styles.button} onPress={navigateBigFive}>
          Take the Inventory
        </Button>
      </Layout>
    </SafeAreaView>
  );
}
