import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import { RootStackParamList } from './types';
import { ROUTES } from '../constants';
import { RootState, AppDispatch } from '../redux/store';
import { loadCurrentUser } from '../redux/slices/authSlice';
import { ActivityIndicator, View } from 'react-native';

// Screens
import { SplashScreen } from '../screens/Splash';
import { LoginScreen } from '../screens/Login';
import { RegisterScreen } from '../screens/Register';
import { HomeScreen } from '../screens/Home';
import { AddTaskScreen } from '../screens/AddTask';
import { TaskDetailsScreen } from '../screens/TaskDetails';
import { ProfileScreen } from '../screens/Profile';
import { getToken } from '../utils/tokenManager';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isInitializing, setIsInitializing] = React.useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const minimumDelay = new Promise(resolve => setTimeout(resolve, 2000));
      const authProcess = (async () => {
        const token = await getToken();
        if (token) {
          await dispatch(loadCurrentUser());
        }
      })();

      await Promise.all([minimumDelay, authProcess]);
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch]);

  if (isInitializing) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth Stack
          <>
            <Stack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
          </>
        ) : (
          // Main Stack
          <>
            <Stack.Screen name={ROUTES.HOME} component={HomeScreen} />
            <Stack.Screen name={ROUTES.ADD_TASK} component={AddTaskScreen} />
            <Stack.Screen name={ROUTES.TASK_DETAILS} component={TaskDetailsScreen} />
            <Stack.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
