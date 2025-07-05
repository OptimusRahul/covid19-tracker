import { useQuery } from '@tanstack/react-query';
import { covidApi } from '@/services/covidApi';


// Query keys
export const QUERY_KEYS = {
  globalSummary: ['globalSummary'],
  countriesData: ['countriesData'],
  countryData: (country: string) => ['countryData', country],
  chartData: (country?: string) => ['chartData', country],
} as const;

// Global summary hook
export const useGlobalSummary = () => {
  return useQuery({
    queryKey: QUERY_KEYS.globalSummary,
    queryFn: async () => {
      const response = await covidApi.getGlobalSummary();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Countries data hook
export const useCountriesData = () => {
  return useQuery({
    queryKey: QUERY_KEYS.countriesData,
    queryFn: async () => {
      const response = await covidApi.getCountriesData();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 3,
  });
};

// Country specific data hook
export const useCountryData = (country: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.countryData(country),
    queryFn: async () => {
      const response = await covidApi.getCountryData(country);
      return response.data;
    },
    enabled: !!country,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// Chart data hook
export const useChartData = (country?: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.chartData(country),
    queryFn: async () => {
      const response = await covidApi.getChartData(country);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
}; 