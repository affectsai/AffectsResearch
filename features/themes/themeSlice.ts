import {createSlice} from "@reduxjs/toolkit";

interface ThemeState {
  currentTheme: string;
}

const initialState = { currentTheme: 'light' } as ThemeState

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


