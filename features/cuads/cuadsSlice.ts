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

import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {randomUUID} from "expo-crypto";
import feathersApp, {
  createUser,
  defineUser,
  getAuthToken,
  getCurrentUser,
  setAuthorizationHeader
} from "../../backend/affectsBackend";
import Constants from 'expo-constants'

export interface IdState {
  participantId: string;
  validation: string;
  authenticated: boolean;
}

const initialState = {
  participantId: randomUUID(),
  validation: randomUUID(),
  authenticated: false
} as IdState

interface SetIdentityAction {
  type: string,
  payload: {
    participantId: string,
  }
}

export const validateParticipantID = createAsyncThunk(
    'identity/validateParticipantID',
    async(participantData: IdState, thunkAPI) => {
      let authId;
      try {
        if (participantData.validation == undefined || participantData.validation.trim().length==0) {
          participantData.validation = participantData.participantId
        }
        authId = await getAuthToken(participantData.participantId, participantData.validation)
        if (authId == undefined )
        {
          console.log("ParticipantID is invalid, creating a new one: " + participantData.participantId + " " + participantData.validation)
          await createUser(participantData.participantId, participantData.validation)
          authId = await getAuthToken(participantData.participantId, participantData.validation)
        }

        if (authId) {
          setAuthorizationHeader(authId)
          return getCurrentUser()
        }
      } catch (e) {
        console.log("An error occurred validating the participant ID: " + e)
      }

      return {}
    }
);

/**
 * identitySlice manages the ParticipantID code...
 */
const identitySlice = createSlice({
  name: 'identity',
  initialState,
  reducers: {
    resetID(state) {
      state.participantId = randomUUID();
      state.validation = randomUUID();
      state.authenticated = false;
    },
    setID(state, action: SetIdentityAction) {
      state.participantId = action.payload.participantId;
      state.validation = randomUUID()
      state.authenticated = false
      console.log(action.payload.participantId)
    },
    clearID(state) {
      state.participantId = '';
      state.authenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(validateParticipantID.fulfilled, (state, action) => {
      // Add user to the state array
      if ((action.payload as IdState).participantId === state.participantId) {
        state.authenticated = true
      }
    })
  },
})



export const {clearID, resetID, setID} = identitySlice.actions;
export const selectIdentity = (state: { identity: IdState }) => state.identity.participantId;
export const selectValidation = (state: { identity: IdState }) => state.identity.validation;
export const selectAuthenticated = (state: { identity: IdState }) => state.identity.authenticated;

export default identitySlice.reducer;


