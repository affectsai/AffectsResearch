/* Copyright (C) 2024 Affects AI LLC - All Rights Reserved
 *
 * You may use, distribute and modify this code under the terms of
 * the CC BY-SA-NC 4.0 license.
 *
 * You should have received a copy of the CC BY-SA-NC 4.0 license
 * with this file. If not, please write to info@affects.ai or
 * visit:
 *    https://creativecommons.org/licenses/by-nc-sa/4.0/deed.en
 */

import {createSlice} from "@reduxjs/toolkit";

interface AuthenticationState {
  strategy: string;
  access_token: string|undefined;
}

interface StoreTokenAction {
  type: string,
  payload: {
    strategy: string | undefined
    access_token: string,
  }
}

const initialState = {
  strategy: '',
  access_token: undefined
} as AuthenticationState

const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Saves the OAUTH AccessToken in our state.
     */
    storeToken(state, action: StoreTokenAction) {
      if (action.payload.strategy)
        state.strategy = action.payload.strategy;
      state.access_token = action.payload.access_token;
    },

    /**
     * Destroys the OAUTH AccessToken. Does not log out of the remote service.
     */
    logout(state) {
      state.strategy = '';
      state.access_token = undefined;
    }
  }
})

export const storeTokenActionPayload = (strategy: string, access_token: string) => {
  return {
    "strategy": strategy,
    "access_token": access_token,
  }
}

/*
 * Selectors...
 */

export const {storeToken, logout} = authenticationSlice.actions;
export const selectStrategy = (state: { auth: { strategy: any; }; }) => state.auth.strategy;
export const selectAuthToken = (state: { auth: { access_token: any; }; }) => state.auth.access_token;

export default authenticationSlice.reducer;


