// Base API Response Types
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  timestamp: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// COVID-19 Data Types (Enhanced from existing)
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
  countryCode: string;
  confirmed: number;
  deaths: number;
  recovered: number;
  active: number;
  lastUpdated: string;
  latitude?: number;
  longitude?: number;
  region?: string;
  population?: number;
  
  // Calculated fields
  deathRate?: number;
  recoveryRate?: number;
  casesPerMillion?: number;
}

export interface HistoricalData {
  date: string;
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface CountryDetail extends CountrySummary {
  historicalData: HistoricalData[];
  vaccinations?: VaccinationData;
  testing?: TestingData;
  hospitalizations?: HospitalizationData;
}

export interface VaccinationData {
  totalVaccinations: number;
  peopleVaccinated: number;
  peopleFullyVaccinated: number;
  dailyVaccinations: number;
  vaccinationsPerHundred: number;
}

export interface TestingData {
  totalTests: number;
  testsPerMillion: number;
  positiveRate: number;
  dailyTests: number;
}

export interface HospitalizationData {
  currentHospitalizations: number;
  currentICU: number;
  weeklyHospitalAdmissions: number;
  weeklyICUAdmissions: number;
}

// API Endpoint Types
export type CovidEndpoint = 
  | 'global'
  | 'countries'
  | 'country'
  | 'historical'
  | 'vaccinations'
  | 'testing';

export interface ApiRequestConfig {
  endpoint: CovidEndpoint;
  params?: Record<string, string | number>;
  retries?: number;
  timeout?: number;
} 