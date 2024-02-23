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

import {createSlice} from "@reduxjs/toolkit";
import {randomUUID} from "expo-crypto";

interface IdState {
  identity: string;
}

const initialState = { identity: randomUUID() } as IdState
interface SetIdentityAction {
  type: string,
  payload: {
    identity: string,
  }
}

/**
 * identitySlice manages the ParticipantID code...
 */
const identitySlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    resetID(state) {
      state.identity = randomUUID();
    },
    setID(state, action: SetIdentityAction) {
      state.identity = action.payload.identity;
    },
    clearID(state) {
      state.identity = '';
    }
  }
})

export const {clearID, resetID, setID} = identitySlice.actions;
export const selectIdentity = (state: { theme: IdState }) => state.identity.identity;

export default identitySlice.reducer;


