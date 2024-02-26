import {configureStore, ThunkMiddleware} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import themeReducer from '../features/themes/themeSlice';
import bfi1Reducer from '../features/personality/bigFiveInventory1Slice'
import bfi2Reducer from '../features/personality/bigFiveInventory2Slice'
import authReducer from '../features/authentication/authenticationSlice';
import identityReducer from '../features/identification/idSlice'

import createSecureStore from "redux-persist-expo-securestore";


const persistThemeConfig = {
  key: 'affectsresearch-theme',
  storage: AsyncStorage,
}
const persistedThemeReducer = persistReducer(persistThemeConfig, themeReducer)

const persistBigFive1Config = {
    key: 'affectsresearch-bfi1',
    storage: AsyncStorage,
}
const persisteBigFive1Reducer = persistReducer(persistBigFive1Config, bfi1Reducer);

const persistBigFive2Config = {
    key: 'affectsresearch-bfi2',
    storage: AsyncStorage,
}
const persisteBigFive2Reducer = persistReducer(persistBigFive2Config, bfi2Reducer);

const secureStorage = createSecureStore();
const persistAuthConfig = {
    key: 'affectsresearch-auth',
    storage: secureStorage,
}
const persisteAuthReducer = persistReducer(persistAuthConfig, authReducer);

const persistIDConfig = {
    key: 'affectsresearch-id',
    storage: secureStorage,
}
const persistIDReducer = persistReducer(persistIDConfig, identityReducer);

export const store = configureStore({
  reducer: {
      theme: persistedThemeReducer,
      bigfive: persisteBigFive1Reducer,
      bigfive2: persisteBigFive2Reducer,
      auth: persisteAuthReducer,
      identity: persistIDReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
          thunk: {

          }
      }),
});


export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch;
export default store;

