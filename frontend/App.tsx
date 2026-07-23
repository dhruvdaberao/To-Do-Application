/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/redux/store';
import { AppThemeProvider } from './src/components/ui/AppThemeProvider';
import { RootNavigator } from './src/navigation';

function App(): React.JSX.Element {
  return (
    <StoreProvider store={store}>
      <AppThemeProvider>
        <SafeAreaProvider>
          <RootNavigator />
        </SafeAreaProvider>
      </AppThemeProvider>
    </StoreProvider>
  );
}

export default App;
