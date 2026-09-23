import { useState } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services';
import { LoginPayload, RegisterPayload, AuthHookResult } from '../types';

export interface UseAuthOptions {
  navigation?: any;
}

export const useAuth = ({ navigation }: UseAuthOptions = {}): AuthHookResult => {

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // --- Helper Validations (Regular Functions) ---
  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value.trim());
  };
  const cleanPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 12 && digits.startsWith('91')) {
      return digits.slice(2);
    }
    if (digits.length === 11 && digits.startsWith('0')) {
      return digits.slice(1);
    }
    return digits;
  };
  const isValidPhone = (value: string): boolean => {
    const cleaned = cleanPhoneNumber(value);
    return /^[6-9]\d{9}$/.test(cleaned) || /^\d{10}$/.test(cleaned);
  };
  // --- 1. Password / Credential Login ---
  const login = async (loginId: string, password?: string) => {
    const trimmedLoginId = loginId.trim();

    if (!trimmedLoginId) {
      Alert.alert('Validation Error', 'Please enter your email or mobile number.');
      return { success: false, error: 'Identifier is required' };
    }

    const isPhone = /^\+?\d+$/.test(trimmedLoginId);
    if (isPhone && !isValidPhone(trimmedLoginId)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return { success: false, error: 'Invalid phone number' };
    }

    if (!isPhone && !isValidEmail(trimmedLoginId)) {
      Alert.alert('Validation Error', 'Please enter a valid email address (e.g., user@example.com).');
      return { success: false, error: 'Invalid email address' };
    }

    if (!password || password.trim().length === 0) {
      Alert.alert('Validation Error', 'Please enter your password.');
      return { success: false, error: 'Password is required' };
    }

    setLoading(true);
    setError(null);

    try {
      const payload: LoginPayload = {
        email: trimmedLoginId,
        password,
      };

      const res = await authService.login(payload);
      setLoading(false);

      if (res.ok) {
        return { success: true, data: res.data };
      } else {
        const errMsg = res.data?.message || 'Login failed. Please check your credentials.';
        setError(errMsg);
        Alert.alert('Login Failed', errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      setLoading(false);
      const errMsg = err?.message || 'Unable to connect to the server. Please try again.';
      setError(errMsg);
      Alert.alert('Network Error', errMsg);
      return { success: false, error: errMsg };
    }
  };
  // --- 2. User Registration ---
  const register = async (payload: RegisterPayload, agreeTerms: boolean = true) => {
    if (!payload.firstName?.trim()) {
      Alert.alert('Validation Error', 'First name is required.');
      return { success: false, error: 'First name is required' };
    }

    const trimmedEmail = payload.email?.trim();
    if (!trimmedEmail) {
      Alert.alert('Validation Error', 'Email address is required.');
      return { success: false, error: 'Email is required' };
    }

    if (!isValidEmail(trimmedEmail)) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return { success: false, error: 'Invalid email' };
    }

    if (payload.phone && !isValidPhone(payload.phone)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return { success: false, error: 'Invalid phone' };
    }

    if (!payload.password || payload.password.length < 6) {
      Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
      return { success: false, error: 'Password too short' };
    }

    if (!agreeTerms) {
      Alert.alert('Terms & Conditions', 'Please accept the Terms of Service and Privacy Policy to continue.');
      return { success: false, error: 'Terms not accepted' };
    }

    setLoading(true);
    setError(null);

    try {
      const cleanedPayload: RegisterPayload = {
        ...payload,
        email: trimmedEmail,
        phone: payload.phone ? cleanPhoneNumber(payload.phone) : undefined,
      };

      const res = await authService.register(cleanedPayload);
      setLoading(false);

      if (res.ok) {
        Alert.alert('Success', 'Account registered successfully!');
        return { success: true, data: res.data };
      } else {
        const errMsg = res.data?.message || 'Registration failed. Please try again.';
        setError(errMsg);
        Alert.alert('Registration Failed', errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      setLoading(false);
      const errMsg = err?.message || 'Unable to register. Please check your network connection.';
      setError(errMsg);
      Alert.alert('Network Error', errMsg);
      return { success: false, error: errMsg };
    }
  };
  const sendOtp = async (phone: string) => {
    const cleaned = cleanPhoneNumber(phone);
    if (!cleaned || !isValidPhone(cleaned)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return { success: false, error: 'Invalid mobile number' };
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.sendOtp(cleaned);
      setLoading(false);

      if (res.ok) {
        return { success: true, data: res.data, phoneNumber: cleaned };
      } else {
        const errMsg = res.data?.message || 'Failed to send OTP. Please try again.';
        setError(errMsg);
        Alert.alert('Error', errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      setLoading(false);
      const errMsg = err?.message || 'Unable to send OTP. Please try again later.';
      setError(errMsg);
      Alert.alert('Network Error', errMsg);
      return { success: false, error: errMsg };
    }
  };
  const verifyOtp = async (phone: string, otp: string) => {
    const cleaned = cleanPhoneNumber(phone);
    const trimmedOtp = otp.trim();

    if (trimmedOtp.length !== 6) {
      Alert.alert('Validation Error', 'Please enter the complete 6-digit OTP.');
      return { success: false, error: 'Incomplete OTP' };
    }

    setLoading(true);
    setError(null);

    try {
      const res = await authService.verifyOtp(cleaned, trimmedOtp);
      setLoading(false);

      if (res.ok) {
        return { success: true, data: res.data };
      } else {
        const errMsg = res.data?.message || 'Invalid OTP. Please check and try again.';
        setError(errMsg);
        Alert.alert('Verification Failed', errMsg);
        return { success: false, error: errMsg };
      }
    } catch (err: any) {
      setLoading(false);
      const errMsg = err?.message || 'Unable to verify OTP. Please try again.';
      setError(errMsg);
      Alert.alert('Network Error', errMsg);
      return { success: false, error: errMsg };
    }
  };
  return {
    loading,
    error,
    login,
    register,
    sendOtp,
    verifyOtp,
    isValidEmail,
    isValidPhone,
    cleanPhoneNumber,
  };
};

export default useAuth;
