// COVID-19 Data Types
export interface CountryCovidData {
  country: string;
  region?: string;
  cases: {
    [date: string]: {
      total: number;
      new: number;
    };
  };
}

export interface GlobalSummary {
  totalConfirmed: number;
  totalDeaths: number;
  totalRecovered: number;
  newConfirmed: number;
  newDeaths: number;
  newRecovered: number;
  lastUpdated: string;
}

export interface CountrySummary {
  country: string;
  confirmed: number;
  deaths: number;
  recovered: number;
  active: number;
  countryCode: string;
  latitude?: number;
  longitude?: number;
  lastUpdated: string;
}

export interface ChartData {
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// API Ninjas COVID-19 Response Types
export interface ApiNinjasCovidResponse {
  cases: number;
  deaths: number;
  recovered: number;
  country: string;
  population: number;
  sq_km_area: number;
  life_expectancy: string;
  elevation_in_meters: number;
  continent: string;
  abbreviation: string;
  location: string;
  iso: number;
  capital_city: string;
  lat: string;
  long: string;
  updated: string;
}

// Alternative data source structure for fallback
export interface FallbackCovidData {
  cases: number;
  deaths: number;
  recovered: number;
  country: string;
}

// UI component types
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export interface CountryListProps {
  countries: CountrySummary[];
  selectedCountry?: string;
  onCountrySelect: (country: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
} 