/**
 * Core User & Authentication Models
 */
export interface User {
  id: string | number;
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  role?: 'user' | 'admin' | string;
  avatar?: string;
  token?: string;
}

/**
 * Payload sent during Email/Password or Phone/Password Login
 */
export interface LoginPayload {
  email: string;
  password?: string;
}

/**
 * Payload sent during User Registration
 */
export interface RegisterPayload {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
  role?: string;
}

/**
 * Payload sent for mobile OTP requests
 */
export interface SendOtpPayload {
  phone: string;
}

/**
 * Payload sent for verifying received OTP
 */
export interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

/**
 * Standard Auth Response from Backend API
 */
export interface AuthResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
  message?: string;
}

/**
 * Auth Hook Return Structure
 */
export interface AuthHookResult {
  loading: boolean;
  error: string | null;
  login: (loginId: string, password?: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  register: (payload: RegisterPayload, agreeTerms?: boolean) => Promise<{ success: boolean; data?: any; error?: string }>;
  sendOtp: (phone: string) => Promise<{ success: boolean; data?: any; phoneNumber?: string; error?: string }>;
  verifyOtp: (phone: string, otp: string) => Promise<{ success: boolean; data?: any; error?: string }>;
  isValidEmail: (value: string) => boolean;
  isValidPhone: (value: string) => boolean;
  cleanPhoneNumber: (value: string) => string;
}
