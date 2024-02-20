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
import {useDispatch} from "react-redux";
import {toggleTheme} from "../features/themes/themeSlice";
import axios from 'axios'
import * as Linking from 'expo-linking'
import * as WebBrowser from 'expo-web-browser';

import { feathers } from '@feathersjs/feathers'
import rest from '@feathersjs/rest-client'
import authentication from '@feathersjs/authentication-client'
import AsyncStorage from "@react-native-async-storage/async-storage";

const app = feathers()
const restClient = rest("https://api.affects.ai");
app.configure(restClient.axios(axios))
app.configure(authentication({
  storage: AsyncStorage,
  path: '/authentication/google'
}))

const prefix = Linking.createURL("/");
const HeartIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="heart" />;

export function HomeScreen({
  navigation,
}: HomeScreenNavigationProp): React.JSX.Element {
  const navigateDetails = () => {
    navigation.navigate('Details');
  };
  const navigateBigFive = () => {
    navigation.navigate('BigFive');
  };
  const dispatch = useDispatch();

  const queryUsersAsync = async () => {
    app.service("users").find().then((r) => {
      console.log(JSON.stringify(r))
    }).catch((e) => {
      console.log(e)
    })
  }

  const authAsync = async () => {
    console.log(prefix)
    const callbackUrl = Linking.createURL("App", {scheme:"affectsai"});
    Linking.addEventListener("url", (event) => {
      const access_token = event.url.substring(event.url.indexOf("=")+1);
      app.authentication.setAccessToken(access_token);
      app.reAuthenticate()
      return queryUsersAsync();

    })
    await WebBrowser.openAuthSessionAsync(`https://api.affects.ai/oauth/google?redirect=${callbackUrl}`);
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
            onPress={()=>app.authentication.logout()}
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
