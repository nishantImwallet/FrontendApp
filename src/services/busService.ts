import { API_ENDPOINTS } from './apiConfig';

export interface BusSearchParams {
  origin: string;
  destination: string;
  date?: string;
}


export const busService = {
  /**
   * 1. Search unique bus cities for Origin/Destination autocomplete
   * Calls: GET /api/buses/cities?query=del
   * @param query e.g. "del" ya empty string saari cities ke liye
   */
  async searchCities(query: string = ''): Promise<string[]> {
    try {
      const url = query
        ? `${API_ENDPOINTS.BUS_CITIES}?query=${encodeURIComponent(query)}`
        : API_ENDPOINTS.BUS_CITIES;

      const res = await fetch(url);
      const data = await res.json();
      return data.cities || [];
    } catch (error) {
      console.error('[busService.searchCities Error]:', error);
      throw error;
    }
  },

  /**
   * 2. Search buses between two cities with optional date
   * Calls: GET /api/buses/search?origin=Delhi&destination=Jaipur&date=2026-10-15
   */
  async searchBuses(params: BusSearchParams) {
    try {
      const queryParts: string[] = [];
      if (params.origin) queryParts.push(`origin=${encodeURIComponent(params.origin)}`);
      if (params.destination) queryParts.push(`destination=${encodeURIComponent(params.destination)}`);
      if (params.date) queryParts.push(`date=${encodeURIComponent(params.date)}`);

      const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
      const url = `${API_ENDPOINTS.BUS_SEARCH}${queryString}`;

      const res = await fetch(url);
      const data = await res.json();
      return data.buses || [];
    } catch (error) {
      console.error('[busService.searchBuses Error]:', error);
      throw error;
    }
  },
};

