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


