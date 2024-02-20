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

const initialState = { strategy: '', access_token: undefined } as AuthenticationState

const authenticationSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    storeToken(state, action: StoreTokenAction) {
      if (action.payload.strategy)
        state.strategy = action.payload.strategy;
      state.access_token = action.payload.access_token;
    },
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
export const {storeToken, logout} = authenticationSlice.actions;
export const selectStrategy = (state: { auth: { strategy: any; }; }) => state.auth.strategy;
export const selectAuthToken = (state: { auth: { access_token: any; }; }) => state.auth.access_token;

export default authenticationSlice.reducer;


