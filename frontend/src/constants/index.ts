export const ROUTES = {
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER: 'Register',
  HOME: 'Home',
  ADD_TASK: 'AddTask',
  TASK_DETAILS: 'TaskDetails',
  PROFILE: 'Profile',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  TASKS: '/tasks',
};

export const COLORS = {
  primary: '#6200EE',
  secondary: '#03DAC6',
  background: '#F6F6F6',
  surface: '#FFFFFF',
  text: '#000000',
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#B00020',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TYPOGRAPHY = {
  header: { fontSize: 24, fontWeight: 'bold' },
  title: { fontSize: 20, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 12, fontWeight: '300' },
};

export const STRINGS = {
  appName: 'TaskFlow',
  welcomeMessage: 'Welcome to TaskFlow',
};
