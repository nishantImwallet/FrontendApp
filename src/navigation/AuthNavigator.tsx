import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginWithOtpScreen from '../screens/LoginWithOtpScreen';
import OtpLoginScreen from '../screens/OtpLoginScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  Otp: undefined;
  LoginWithOtp: undefined;
  VerifyOtp: { phoneNumber?: string } | undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = (): React.JSX.Element => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen as React.ComponentType<any>} />
      <Stack.Screen name="Register" component={RegisterScreen as React.ComponentType<any>} />
      <Stack.Screen name="Otp" component={OtpLoginScreen as React.ComponentType<any>} />
      <Stack.Screen name="LoginWithOtp" component={LoginWithOtpScreen as React.ComponentType<any>} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen as React.ComponentType<any>} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
