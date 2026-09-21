import { API_ENDPOINTS } from './apiConfig';

export interface Airport {
  id?: number;
  code: string;
  name: string;
  city: string;
  country: string;
}

export const airportService = {
  /**
  
   * @param query 
   */
  async searchAirports(query: string = ''): Promise<Airport[]> {
    try {
      const url = `${API_ENDPOINTS.AIRPORTS}?query=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      const data = await res.json();
      
      const list = Array.isArray(data) ? data : Array.isArray(data.data) ? data.data : [];
      return list;
    } catch (error) {
      console.error('[airportService.searchAirports Error]:', error);
      throw error;
    }
  },
};
