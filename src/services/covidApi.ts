import axios from 'axios';
import type { 
  CountryCovidData, 
  GlobalSummary, 
  CountrySummary, 
  ChartData,
  ApiNinjasCovidResponse,
  ApiResponse
} from '@/types/covid';
import type { HistoricalData } from '@/types/api';

// API Configuration
const API_NINJAS_KEY = import.meta.env?.VITE_API_NINJAS_KEY || 'YOUR_API_KEY_HERE';
const API_NINJAS_BASE_URL = 'https://api.api-ninjas.com/v1';

// Axios instance for API Ninjas
const apiNinjasClient = axios.create({
  baseURL: API_NINJAS_BASE_URL,
  headers: {
    'X-Api-Key': API_NINJAS_KEY,
  },
});

// Country coordinates for map visualization
const COUNTRY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'United States': { lat: 39.8283, lng: -98.5795 },
  'India': { lat: 20.5937, lng: 78.9629 },
  'Brazil': { lat: -14.2350, lng: -51.9253 },
  'Russia': { lat: 61.5240, lng: 105.3188 },
  'France': { lat: 46.6034, lng: 1.8883 },
  'Iran': { lat: 32.4279, lng: 53.6880 },
  'Germany': { lat: 51.1657, lng: 10.4515 },
  'Turkey': { lat: 38.9637, lng: 35.2433 },
  'United Kingdom': { lat: 55.3781, lng: -3.4360 },
  'Italy': { lat: 41.8719, lng: 12.5674 },
  'China': { lat: 35.8617, lng: 104.1954 },
  'Spain': { lat: 40.4637, lng: -3.7492 },
  'Ukraine': { lat: 48.3794, lng: 31.1656 },
  'Argentina': { lat: -38.4161, lng: -63.6167 },
  'Netherlands': { lat: 52.1326, lng: 5.2913 },
  'Poland': { lat: 51.9194, lng: 19.1451 },
  'Colombia': { lat: 4.5709, lng: -74.2973 },
  'Mexico': { lat: 23.6345, lng: -102.5528 },
  'Japan': { lat: 36.2048, lng: 138.2529 },
  'Australia': { lat: -25.2744, lng: 133.7751 },
  'Canada': { lat: 56.1304, lng: -106.3468 },
  'South Korea': { lat: 35.9078, lng: 127.7669 },
  'Indonesia': { lat: -0.7893, lng: 113.9213 },
  'Peru': { lat: -9.1900, lng: -75.0152 },
  'Czech Republic': { lat: 49.8175, lng: 15.4730 },
  'Chile': { lat: -35.6751, lng: -71.5430 },
  'Romania': { lat: 45.9432, lng: 24.9668 },
  'Belgium': { lat: 50.5039, lng: 4.4699 },
  'Iraq': { lat: 33.2232, lng: 43.6793 },
  'Bangladesh': { lat: 23.6850, lng: 90.3563 },
  'Philippines': { lat: 12.8797, lng: 121.7740 },
  'Pakistan': { lat: 30.3753, lng: 69.3451 },
  'South Africa': { lat: -30.5595, lng: 22.9375 },
  'Israel': { lat: 31.0461, lng: 34.8516 },
  'Malaysia': { lat: 4.2105, lng: 101.9758 },
  'Thailand': { lat: 15.8700, lng: 100.9925 },
  'Vietnam': { lat: 14.0583, lng: 108.2772 },
  'Switzerland': { lat: 46.8182, lng: 8.2275 },
  'Austria': { lat: 47.5162, lng: 14.5501 },
  'Serbia': { lat: 44.0165, lng: 21.0059 },
  'Hungary': { lat: 47.1625, lng: 19.5033 },
  'Jordan': { lat: 30.5852, lng: 36.2384 },
  'Greece': { lat: 39.0742, lng: 21.8243 },
  'Nepal': { lat: 28.3949, lng: 84.1240 },
  'United Arab Emirates': { lat: 23.4241, lng: 53.8478 },
  'Kazakhstan': { lat: 48.0196, lng: 66.9237 },
  'Morocco': { lat: 31.7917, lng: -7.0926 },
  'Bulgaria': { lat: 42.7339, lng: 25.4858 },
  'Tunisia': { lat: 33.8869, lng: 9.5375 },
  'Lebanon': { lat: 33.8547, lng: 35.8623 },
  'Cuba': { lat: 21.5218, lng: -77.7812 },
  'Belarus': { lat: 53.7098, lng: 27.9534 },
  'Guatemala': { lat: 15.7835, lng: -90.2308 },
  'Croatia': { lat: 45.1000, lng: 15.2000 },
  'Bolivia': { lat: -16.2902, lng: -63.5887 },
  'Slovakia': { lat: 48.6690, lng: 19.6990 },
  'Dominican Republic': { lat: 18.7357, lng: -70.1627 },
  'Lithuania': { lat: 55.1694, lng: 23.8813 },
  'Slovenia': { lat: 46.1512, lng: 14.9955 },
  'Paraguay': { lat: -23.4425, lng: -58.4438 },
  'Kuwait': { lat: 29.3117, lng: 47.4818 },
  'Latvia': { lat: 56.8796, lng: 24.6032 },
  'Estonia': { lat: 58.5953, lng: 25.0136 },
  'Mongolia': { lat: 47.0105, lng: 106.9180 },
  'Uruguay': { lat: -32.5228, lng: -55.7658 },
  'Cyprus': { lat: 35.1264, lng: 33.4299 },
  'Panama': { lat: 8.5380, lng: -80.7821 },
  'Costa Rica': { lat: 9.7489, lng: -83.7534 },
};

// Mock data for development and fallback
const MOCK_GLOBAL_DATA: GlobalSummary = {
  totalConfirmed: 704753890,
  totalDeaths: 7010681,
  totalRecovered: 675608264,
  newConfirmed: 12847,
  newDeaths: 85,
  newRecovered: 8934,
  lastUpdated: new Date().toISOString(),
};

const MOCK_COUNTRIES_DATA: CountrySummary[] = Object.entries(COUNTRY_COORDINATES).map(([country, coords]) => ({
  country,
  confirmed: Math.floor(Math.random() * 50000000) + 100000,
  deaths: Math.floor(Math.random() * 500000) + 1000,
  recovered: Math.floor(Math.random() * 45000000) + 50000,
  active: Math.floor(Math.random() * 1000000) + 10000,
  countryCode: country.substring(0, 2).toUpperCase(),
  latitude: coords.lat,
  longitude: coords.lng,
  lastUpdated: new Date().toISOString(),
}));

// API Service Class
class CovidApiService {
  private async handleApiCall<T>(apiCall: () => Promise<T>, fallbackData: T): Promise<ApiResponse<T>> {
    try {
      if (API_NINJAS_KEY === 'YOUR_API_KEY_HERE' || !API_NINJAS_KEY) {
        console.warn('Using fallback data - please set your API key in .env file');
        return {
          data: fallbackData,
          success: true,
          message: 'Using fallback data - API key not configured'
        };
      }

      const data = await apiCall();
      return {
        data,
        success: true
      };
    } catch (error) {
      console.warn('API call failed, using fallback data:', error);
      return {
        data: fallbackData,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getGlobalSummary(): Promise<ApiResponse<GlobalSummary>> {
    return this.handleApiCall(
      async () => {
        const response = await apiNinjasClient.get<ApiNinjasCovidResponse>('/covid19');
        const data = response.data;
        
        return {
          totalConfirmed: data.cases || 0,
          totalDeaths: data.deaths || 0,
          totalRecovered: data.recovered || 0,
          newConfirmed: 0, // API doesn't provide new cases
          newDeaths: 0,
          newRecovered: 0,
          lastUpdated: new Date().toISOString(),
        };
      },
      MOCK_GLOBAL_DATA
    );
  }

  async getCountriesData(): Promise<ApiResponse<CountrySummary[]>> {
    return this.handleApiCall(
      async () => {
        // For now, return enhanced mock data with coordinates
        // In a real implementation, you would fetch this from the API
        // and merge with coordinate data
        return MOCK_COUNTRIES_DATA.sort((a, b) => b.confirmed - a.confirmed);
      },
      MOCK_COUNTRIES_DATA
    );
  }

  async getCountryData(country: string): Promise<ApiResponse<CountryCovidData>> {
    return this.handleApiCall(
      async () => {
        const response = await apiNinjasClient.get<ApiNinjasCovidResponse>(`/covid19?country=${country}`);
        const data = response.data;
        
        return {
          country: country,
          cases: {
            [new Date().toISOString().split('T')[0]]: {
              total: data.cases || 0,
              new: 0, // API doesn't provide new cases
            }
          }
        };
      },
      {
        country: country,
        cases: {
          [new Date().toISOString().split('T')[0]]: {
            total: Math.floor(Math.random() * 1000000),
            new: Math.floor(Math.random() * 10000),
          }
        }
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getChartData(_country?: string): Promise<ApiResponse<ChartData[]>> {
    const mockChartData: ChartData[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        confirmed: Math.floor(Math.random() * 10000) + 1000,
        deaths: Math.floor(Math.random() * 200) + 10,
        recovered: Math.floor(Math.random() * 8000) + 500,
      };
    });

    return this.handleApiCall(
      async () => {
        // In a real implementation, fetch historical data from API
        // The country parameter could be used to filter data
        return mockChartData;
      },
      mockChartData
    );
  }

  async getHistoricalData(_countryCode: string, days: number = 30): Promise<ApiResponse<HistoricalData[]>> {
    const mockHistoricalData: HistoricalData[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return {
        date: date.toISOString().split('T')[0],
        confirmed: Math.floor(Math.random() * 10000) + 1000,
        deaths: Math.floor(Math.random() * 200) + 10,
        recovered: Math.floor(Math.random() * 8000) + 500,
      };
    });

    return this.handleApiCall(
      async () => {
        // In a real implementation, fetch historical data from API for specific country
        // The countryCode parameter would be used to filter data
        return mockHistoricalData;
      },
      mockHistoricalData
    );
  }
}

// Export singleton instance
export const covidApi = new CovidApiService(); 