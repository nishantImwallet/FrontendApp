import { API_ENDPOINTS } from './apiConfig';

export interface Booking {
  id: number;
  user_id: number;
  flight_id: number;
  booking_status: string;
  total_amount: number;
  Flight?: any;
  Seat?: any;
}

export const bookingService = {
  async getUserBookings(userId: number | string): Promise<Booking[]> {
    try {
      const url = `${API_ENDPOINTS.BOOKINGS}/my-bookings?user_id=${userId}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.bookings || [];
    } catch (error) {
      console.error('[bookingService.getUserBookings Error]:', error);
      throw error;
    }
  },
  async createBooking(bookingData: { user_id: number; flight_id: number; seat_id?: number; passenger_name?: string; seat_number?: string }) {
    try {
      const res = await fetch(API_ENDPOINTS.BOOKINGS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (error) {
      console.error('[bookingService.createBooking Error]:', error);
      throw error;
    }
  },
  async getBoardingPass(bookingId: number | string) {
    try {
      const url = `${API_ENDPOINTS.BOOKINGS}/${bookingId}/boarding-pass`;
      const res = await fetch(url);
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (error) {
      console.error('[bookingService.getBoardingPass Error]:', error);
      throw error;
    }
  },
};


  /**
   * Fetch Digital Boarding Pass by Booking ID
   */
  
