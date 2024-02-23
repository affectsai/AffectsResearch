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

interface ThemeState {
  currentTheme: string;
}

const initialState = { currentTheme: 'light' } as ThemeState

/**
 * themeSlice handles the light/dark theme setting.
 */
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
    }
  }
})

export const {toggleTheme} = themeSlice.actions;
export const selectTheme = (state: { theme: ThemeState }) => state.theme.currentTheme;

export default themeSlice.reducer;


