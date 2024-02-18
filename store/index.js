import {configureStore} from '@reduxjs/toolkit';
import themeReducer from '../features/themes/themeSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";

const persistThemeConfig = {
  key: 'affectsresearch-theme',
  storage: AsyncStorage,
}

const persistedThemeReducer = persistReducer(persistThemeConfig, themeReducer)

export const store = configureStore({
  reducer: {
      theme: persistedThemeReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
});


export const persistor = persistStore(store)

export default store;

