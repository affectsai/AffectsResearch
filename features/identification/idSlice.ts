import {createSlice} from "@reduxjs/toolkit";
import {randomUUID} from "expo-crypto";

interface IdState {
  identity: string;
}

const initialState = { identity: randomUUID() } as IdState

const identitySlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    resetID(state) {
      state.identity = randomUUID();
    },
    setID(state, action) {
      const newID = action.payload.identity;
      if (! newID && newID !== state.identity) {
        state.identity = newID;
      }
    },
    clearID(state) {
      state.identity = '';
    }
  }
})

export const {clearID, resetID, setID} = identitySlice.actions;
export const selectIdentity = (state: { theme: IdState }) => state.identity.identity;

export default identitySlice.reducer;


