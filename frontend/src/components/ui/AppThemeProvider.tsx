import React, { useEffect } from 'react';
import { PaperProvider, MD3LightTheme, MD3DarkTheme, Snackbar, configureFonts } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { hideSnackbar, setTheme } from '../../redux/slices/uiSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontConfig = {
  fontFamily: 'Poppins-Regular',
};

const customTypography = configureFonts({config: fontConfig});

// Quirky, Minimalistic Light Green Theme
const LightGreenTheme = {
  ...MD3LightTheme,
  fonts: customTypography,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50', // Vibrant green
    onPrimary: '#FFFFFF',
    primaryContainer: '#E8F5E9', // Very light green
    onPrimaryContainer: '#2E7D32',
    secondary: '#81C784',
    secondaryContainer: '#C8E6C9',
    background: '#FAFAFA', // Clean off-white
    surface: '#FFFFFF',
    surfaceVariant: '#F1F8E9',
    onSurfaceVariant: '#424242',
    outline: '#A5D6A7',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level1: '#F1F8E9',
      level2: '#E8F5E9',
      level3: '#E8F5E9',
    },
  },
  roundness: 24, // Quirky pill-shaped roundness
};

const DarkGreenTheme = {
  ...MD3DarkTheme,
  fonts: customTypography,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784',
    onPrimary: '#1B5E20',
    primaryContainer: '#2E7D32',
    onPrimaryContainer: '#C8E6C9',
    secondary: '#A5D6A7',
    secondaryContainer: '#388E3C',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2E3B32',
    onSurfaceVariant: '#E0E0E0',
    outline: '#4CAF50',
  },
  roundness: 24,
};

export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isDarkMode, snackbarVisible, snackbarMessage } = useSelector((state: RootState) => state.ui);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark') {
        dispatch(setTheme(true));
      }
    };
    loadTheme();
  }, [dispatch]);

  const theme = isDarkMode ? DarkGreenTheme : LightGreenTheme;

  return (
    <PaperProvider theme={theme}>
      {children}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => dispatch(hideSnackbar())}
        duration={3000}
        style={{ borderRadius: 24, backgroundColor: theme.colors.primaryContainer }}
        theme={{ colors: { onSurface: theme.colors.onPrimaryContainer, inversePrimary: theme.colors.primary } }}
        action={{
          label: 'OK',
          onPress: () => dispatch(hideSnackbar()),
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </PaperProvider>
  );
};
