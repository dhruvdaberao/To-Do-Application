import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  AddTask: { taskId?: string } | undefined;
  TaskDetails: { taskId: string };
  Profile: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
