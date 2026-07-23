import { MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { COLORS } from '../constants';

export const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.secondary,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
  },
};

// Prepare structure for Dark Theme later
export const DarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    // Dark colors will be added here
  }
};
