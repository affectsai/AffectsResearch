import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist'
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from "redux-persist/es/constants";
import themeReducer from '../features/themes/themeSlice';
import bigfiveReducer from '../features/personality/personalityQuizSlice';

const persistThemeConfig = {
  key: 'affectsresearch-theme',
  storage: AsyncStorage,
}

const persistBigFiveConfig = {
    key: 'affectsresearch-bigfive',
    storage: AsyncStorage,
}

const persistedThemeReducer = persistReducer(persistThemeConfig, themeReducer)
const persisteBigFiveReducer = persistReducer(persistBigFiveConfig, bigfiveReducer);

export const store = configureStore({
  reducer: {
      theme: persistedThemeReducer,
      bigfive: persisteBigFiveReducer,
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

