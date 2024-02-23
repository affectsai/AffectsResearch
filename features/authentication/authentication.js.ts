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

import {feathers} from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import axios from "axios";
import authentication from "@feathersjs/authentication-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Linking from "expo-linking";
import {logout, selectAuthToken, storeToken, storeTokenActionPayload} from "./authenticationSlice";
import {store} from '../../store'
import * as WebBrowser from "expo-web-browser";

export const feathersApp = feathers()
export const feathersClient = rest("https://api.affects.ai");
feathersApp.configure(feathersClient.axios(axios))
feathersApp.configure(authentication({
    storage: AsyncStorage,
    path: '/authentication/google'
}))

export const reauthenticate = async (access_token: string) => {
    feathersApp.authentication.setAccessToken(access_token);
    return feathersApp.authentication.reAuthenticate()
}

Linking.addEventListener("url", (event: Linking.EventType) => {
    const url = event.url.split("#")[0]
    if (url.endsWith("AuthSuccess")) {
        const access_token = event.url.substring(event.url.indexOf("=")+1);
        reauthenticate(access_token).then(()=> {
            store.dispatch(storeToken(storeTokenActionPayload("google", access_token)))
        }).catch((e) => {
            console.log("Unable to reauthenticate the access token... logging out");
            store.dispatch(logout())
        });
    }
});

export const AuthSuccessCallbackURL = Linking.createURL("AuthSuccess", {scheme:"affectsai"});

/**
 * A wrapper that ensures we're authenticated before invoking a service that requires it.
 * @param callback
 */
export const authenticatedServiceCall =
    async ( callback: () => void ) => {
        if (! feathersApp.authentication.authenticated) {
            const authToken = selectAuthToken(store.getState());
            if (authToken) {
                await reauthenticate(authToken);
            }
            else {
                await WebBrowser.openAuthSessionAsync(`https://api.affects.ai/oauth/google?redirect=${AuthSuccessCallbackURL}`)
            }
        }

        if ( feathersApp.authentication.authenticated )
            callback();
        else
            throw {
                message: "Unable to authenticate prior to invoking callback."
            }
    }
