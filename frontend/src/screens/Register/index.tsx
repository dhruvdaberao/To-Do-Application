import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Appbar, TextInput, Button } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { RegisterData } from '../../services/authService';
import { ROUTES } from '../../constants';

export const RegisterScreen = ({ navigation }: any) => {
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterData>();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const onSubmit = async (data: RegisterData) => {
    const resultAction = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(resultAction)) {
      navigation.navigate(ROUTES.LOGIN);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Register" />
      </Appbar.Header>
      
      <View style={styles.formContainer}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Controller
          control={control}
          rules={{ required: 'Email is required', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' } }}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Email"
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.email}
              autoCapitalize="none"
              style={styles.input}
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Controller
          control={control}
          rules={{ required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Password"
              mode="outlined"
              secureTextEntry
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={!!errors.password}
              style={styles.input}
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <Button 
          mode="contained" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading}
          disabled={loading}
          style={styles.button}
        >
          Register
        </Button>

        <Button 
          onPress={() => {
            dispatch(clearError());
            navigation.navigate(ROUTES.LOGIN);
          }}
          style={styles.linkButton}
        >
          Already have an account? Login
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  formContainer: { padding: 16, justifyContent: 'center', flex: 1 },
  input: { marginBottom: 8 },
  button: { marginTop: 16, paddingVertical: 6 },
  linkButton: { marginTop: 16 },
  errorText: { color: 'red', marginBottom: 8, fontSize: 12 },
});
