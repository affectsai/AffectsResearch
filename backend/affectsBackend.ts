import {feathers} from "@feathersjs/feathers";
import rest from "@feathersjs/rest-client";
import axios from "axios";
import authentication from "@feathersjs/authentication-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import {FiveFactoryModel} from "../features/personality/fiveFactoryModel";
import {store} from '../store'
import {selectIdentity} from "../features/identification/idSlice";

export const USER_SERVICE_API = `${Constants.expoConfig?.extra?.affectsai.restAPI}/users`
export const AUTH_SERVICE_API = `${Constants.expoConfig?.extra?.affectsai.restAPI}/authentication`
export const SURVEY_SERVICE_API = `${Constants.expoConfig?.extra?.affectsai.restAPI}/surveys`


const feathersApp = feathers()
export const feathersClient = rest("https://api.affects.ai");

feathersApp.configure(feathersClient.axios(axios))
feathersApp.configure(authentication({
    storage: AsyncStorage,
    jwtStrategy: 'jwt'
    // path: '/authentication/google'
}))

export const setAuthorizationHeader = (authCode: string) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${authCode}`;
}

export const getAuthToken = async ( participantId: string, validationCode: string ): Promise<string|undefined>=> {
    let token = undefined

    try {
        await axios({
            url: AUTH_SERVICE_API,
            method: 'post',
            data: {
                participantId: participantId,
                validation: validationCode,
                strategy: 'local'
            }
        }).then((response) => {
            token = response.data.accessToken
        }).catch((reason) => {

        })
    } catch (e) {
    }

    return token
}

export const createUser = async ( participantId: string, validationCode: string ) => {
    const data = {
            participantId: participantId,
            validation: validationCode
        };
    const headers = {
        'Content-Type': 'application/json',
    }

    await axios.post(
        USER_SERVICE_API,
        JSON.stringify(data),
        {
            headers: headers
        }
    ).then((response) => {
        return true;
    }).catch((reason) => {
        return false;
    })

    return false;
}

export const getCurrentUser = async (  ) => {
    const sentinel = {
        _id: "0",
        particpantId: "-1",
    }

    let result = sentinel;
    await axios.get(
        USER_SERVICE_API,
    ).then((response) => {
        result = response.data.data[0];
    }).catch((reason) => {
        console.log("Err: " + reason)
    })

    return result;
}


export default feathersApp

