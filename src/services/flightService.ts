import { API_ENDPOINTS } from './apiConfig';

export interface FlightSearchParams {
  origin: string;
  destination: string;
  date?: string;
  tripType?: string;
}

export interface Flight {
  id: number;
  flight_number: string;
  airline: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  total_seats: number;
  available_seats: number;
  status: string;
}

export const flightService = {
  /**
   * Search available flights matching route and travel date
   */
  async searchFlights(params: FlightSearchParams): Promise<Flight[]> {
    try {
      const queryParts: string[] = [];
      if (params.origin) queryParts.push(`origin=${encodeURIComponent(params.origin)}`);
      if (params.destination) queryParts.push(`destination=${encodeURIComponent(params.destination)}`);
      if (params.date) queryParts.push(`date=${encodeURIComponent(params.date)}`);

      const url = `${API_ENDPOINTS.FLIGHT_SEARCH}?${queryParts.join('&')}`;
      const res = await fetch(url);
      const data = await res.json();

      const flights = data.flights || (Array.isArray(data) ? data : data.data || []);
      return flights;
    } catch (error) {
      console.error('[flightService.searchFlights Error]:', error);
      throw error;
    }
  },
};
