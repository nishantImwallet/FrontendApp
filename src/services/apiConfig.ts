// Base API Configuration
// Note for Android:
// - Physical device via USB with "adb reverse tcp:5000 tcp:5000": http://localhost:5000/api
// - Android Emulator default loopback: http://10.0.2.2:5000/api
// - Local Wi-Fi IP (e.g. 192.168.x.x): http://<YOUR_IP>:5000/api

export const BASE_URL = 'http://10.0.2.2:5000/api';

export const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  SEND_OTP: `${BASE_URL}/auth/send-otp`,
  VERIFY_OTP: `${BASE_URL}/auth/verify-otp`,
  AIRPORTS: `${BASE_URL}/airports`,
  FLIGHT_SEARCH: `${BASE_URL}/flights/search`,
  FLIGHTS: `${BASE_URL}/flights`,
  BOOKINGS: `${BASE_URL}/bookings`,
  //these are the bus routes here.
  BUSES: `${BASE_URL}/buses`,
  BUS_SEARCH: `${BASE_URL}/buses/search`,
  BUS_CITIES: `${BASE_URL}/buses/cities`,
  BUS_BOOKINGS: `${BASE_URL}/bus-bookings`,
};
