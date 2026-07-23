import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UiState {
  isDarkMode: boolean;
  snackbarMessage: string | null;
  snackbarVisible: boolean;
}

const initialState: UiState = {
  isDarkMode: false,
  snackbarMessage: null,
  snackbarVisible: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      AsyncStorage.setItem('theme', state.isDarkMode ? 'dark' : 'light');
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    showSnackbar: (state, action: PayloadAction<string>) => {
      state.snackbarMessage = action.payload;
      state.snackbarVisible = true;
    },
    hideSnackbar: (state) => {
      state.snackbarVisible = false;
      state.snackbarMessage = null;
    }
  },
});

export const { toggleTheme, setTheme, showSnackbar, hideSnackbar } = uiSlice.actions;
export default uiSlice.reducer;
