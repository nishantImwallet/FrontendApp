import { API_ENDPOINTS } from './apiConfig';
import { LoginPayload, RegisterPayload, AuthResponse } from '../types';

export type { LoginPayload, RegisterPayload, AuthResponse };


export const authService = {
  
  async login(payload: LoginPayload): Promise<AuthResponse> {
    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (error) {
      console.error('[authService.login Error]:', error);
      throw error;
    }
  },

  
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (error) {
      console.error('[authService.register Error]:', error);
      throw error;
    }
  },

  /**
   * Send 6-digit OTP to mobile number
   */
  async sendOtp(phone: string): Promise<AuthResponse> {
    try {
      const res = await fetch(API_ENDPOINTS.SEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (error) {
      console.error('[authService.sendOtp Error]:', error);
      throw error;
    }
  },

  /**
   * Verify entered OTP code
   */
  async verifyOtp(phone: string, otp: string): Promise<AuthResponse> {
    try {
      const res = await fetch(API_ENDPOINTS.VERIFY_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (error) {
      console.error('[authService.verifyOtp Error]:', error);
      throw error;
    }
  },
};
