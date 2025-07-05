import { config } from '../config/environment';
import { API_ENDPOINTS, API_DEFAULTS, ERROR_MESSAGES } from '../constants';
import { CountrySummary, GlobalSummary, CountryDetail, HistoricalData, VaccinationData, TestingData, HospitalizationData } from '../types/api';

// Custom ApiError class
class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, unknown>,
    public timestamp?: string
  ) {
    super(message);
    this.name = 'ApiError';
    this.timestamp = timestamp || new Date().toISOString();
  }
}

// Base API Client Class
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private retryAttempts: number;
  private cache: Map<string, { data: unknown; timestamp: number; ttl: number }>;

  constructor() {
    this.baseURL = config.api.baseURL;
    this.timeout = config.api.timeout;
    this.retryAttempts = config.api.retryAttempts;
    this.cache = new Map();
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private getCacheKey(endpoint: string, params?: Record<string, unknown>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${endpoint}:${paramString}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache<T>(key: string, data: T, ttl: number = API_DEFAULTS.CACHE_DURATION): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    params?: Record<string, unknown>
  ): Promise<T> {
    const cacheKey = this.getCacheKey(endpoint, params);
    const cached = this.getFromCache<T>(cacheKey);

    if (cached) {
      return cached;
    }

    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url.toString(), {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': process.env.REACT_APP_API_KEY || '',
            'X-RapidAPI-Host': 'api.api-ninjas.com',
            ...options.headers,
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new ApiError(
            response.status === 429 ? 'RATE_LIMIT_ERROR' : 'API_ERROR',
            response.status === 429 ? ERROR_MESSAGES.RATE_LIMIT_ERROR : ERROR_MESSAGES.API_ERROR,
            errorData,
            new Date().toISOString()
          );
        }

        const data = await response.json();
        this.setCache(cacheKey, data);
        return data as T;
      } catch (error) {
        lastError = error as Error;

        if (error instanceof ApiError) {
          throw error;
        }

        if (error instanceof Error && error.name === 'AbortError') {
          throw new ApiError(
            'TIMEOUT_ERROR',
            ERROR_MESSAGES.TIMEOUT_ERROR,
            { timeout: this.timeout },
            new Date().toISOString()
          );
        }

        if (attempt === this.retryAttempts) {
          break;
        }

        // Exponential backoff
        const delayMs = Math.min(1000 * Math.pow(2, attempt), 10000);
        await this.delay(delayMs);
      }
    }

    throw new ApiError(
      'NETWORK_ERROR',
      ERROR_MESSAGES.NETWORK_ERROR,
      { originalError: lastError?.message },
      new Date().toISOString()
    );
  }

  public async get<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
    return this.makeRequest<T>(endpoint, { method: 'GET' }, params);
  }

  public async post<T>(endpoint: string, data?: unknown, params?: Record<string, unknown>): Promise<T> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      params
    );
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size;
  }
}

// API Service Class
class CovidApiService {
  private client: ApiClient;

  constructor() {
    this.client = new ApiClient();
  }

  async getGlobalSummary(): Promise<GlobalSummary> {
    try {
      const data = await this.client.get<Record<string, unknown>>(API_ENDPOINTS.GLOBAL_SUMMARY);

      // Transform the API response to match our interface
      return {
        totalConfirmed: (data.totalConfirmed as number) || 0,
        totalDeaths: (data.totalDeaths as number) || 0,
        totalRecovered: (data.totalRecovered as number) || 0,
        newConfirmed: (data.newConfirmed as number) || 0,
        newDeaths: (data.newDeaths as number) || 0,
        newRecovered: (data.newRecovered as number) || 0,
        lastUpdated: (data.lastUpdated as string) || new Date().toISOString(),
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCountries(): Promise<CountrySummary[]> {
    try {
      const data = await this.client.get<Record<string, unknown>[]>(API_ENDPOINTS.COUNTRIES);

      return data.map(country => ({
        country: (country.country as string) || '',
        countryCode: (country.countryCode as string) || '',
        confirmed: (country.confirmed as number) || 0,
        deaths: (country.deaths as number) || 0,
        recovered: (country.recovered as number) || 0,
        active: (country.active as number) || 0,
        lastUpdated: (country.lastUpdated as string) || new Date().toISOString(),
        latitude: country.latitude as number | undefined,
        longitude: country.longitude as number | undefined,
        region: country.region as string | undefined,
        population: country.population as number | undefined,
      }));
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCountryDetail(countryCode: string): Promise<CountryDetail> {
    try {
      const data = await this.client.get<Record<string, unknown>>(API_ENDPOINTS.COUNTRY_DETAIL, { country: countryCode });

      return {
        country: (data.country as string) || '',
        countryCode: (data.countryCode as string) || countryCode,
        confirmed: (data.confirmed as number) || 0,
        deaths: (data.deaths as number) || 0,
        recovered: (data.recovered as number) || 0,
        active: (data.active as number) || 0,
        lastUpdated: (data.lastUpdated as string) || new Date().toISOString(),
        latitude: data.latitude as number | undefined,
        longitude: data.longitude as number | undefined,
        region: data.region as string | undefined,
        population: data.population as number | undefined,
        deathRate: data.deaths && data.confirmed ? (data.deaths as number) / (data.confirmed as number) : 0,
        recoveryRate: data.recovered && data.confirmed ? (data.recovered as number) / (data.confirmed as number) : 0,
        casesPerMillion: data.confirmed && data.population ? ((data.confirmed as number) / (data.population as number)) * 1000000 : 0,
        historicalData: (data.historicalData as HistoricalData[]) || [],
        vaccinations: data.vaccinations as VaccinationData | undefined,
        testing: data.testing as TestingData | undefined,
        hospitalizations: data.hospitalizations as HospitalizationData | undefined,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getHistoricalData(countryCode: string, days: number = 30): Promise<HistoricalData[]> {
    try {
      const data = await this.client.get<HistoricalData[]>(API_ENDPOINTS.HISTORICAL, {
        country: countryCode,
        days,
      });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getVaccinationData(countryCode: string): Promise<VaccinationData> {
    try {
      const data = await this.client.get<VaccinationData>(API_ENDPOINTS.VACCINATIONS, {
        country: countryCode,
      });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    return new ApiError(
      'GENERIC_ERROR',
      ERROR_MESSAGES.GENERIC_ERROR,
      { originalError: error instanceof Error ? error.message : 'Unknown error' },
      new Date().toISOString()
    );
  }

  public clearCache(): void {
    this.client.clearCache();
  }

  public getCacheInfo(): { size: number; keys: string[] } {
    return {
      size: this.client.getCacheSize(),
      keys: [], // Would need to expose cache keys from ApiClient if needed
    };
  }
}

// Mock Service for Development
class MockCovidApiService {
  private generateMockCountries(): CountrySummary[] {
    const mockCountries = [
      { name: 'United States', code: 'US', region: 'north-america', lat: 39.8283, lng: -98.5795 },
      { name: 'Brazil', code: 'BR', region: 'south-america', lat: -14.2350, lng: -51.9253 },
      { name: 'India', code: 'IN', region: 'asia', lat: 20.5937, lng: 78.9629 },
      { name: 'Russia', code: 'RU', region: 'europe', lat: 61.5240, lng: 105.3188 },
      { name: 'France', code: 'FR', region: 'europe', lat: 46.6034, lng: 1.8883 },
      { name: 'United Kingdom', code: 'GB', region: 'europe', lat: 55.3781, lng: -3.4360 },
      { name: 'Turkey', code: 'TR', region: 'asia', lat: 38.9637, lng: 35.2433 },
      { name: 'Iran', code: 'IR', region: 'asia', lat: 32.4279, lng: 53.6880 },
      { name: 'Argentina', code: 'AR', region: 'south-america', lat: -38.4161, lng: -63.6167 },
      { name: 'Germany', code: 'DE', region: 'europe', lat: 51.1657, lng: 10.4515 },
    ];

    return mockCountries.map(country => ({
      country: country.name,
      countryCode: country.code,
      confirmed: Math.floor(Math.random() * 10000000) + 50000,
      deaths: Math.floor(Math.random() * 200000) + 1000,
      recovered: Math.floor(Math.random() * 9500000) + 45000,
      active: Math.floor(Math.random() * 500000) + 5000,
      lastUpdated: new Date().toISOString(),
      latitude: country.lat,
      longitude: country.lng,
      region: country.region,
      population: Math.floor(Math.random() * 300000000) + 10000000,
      deathRate: Math.random() * 0.05, // 0-5%
      recoveryRate: 0.85 + Math.random() * 0.1, // 85-95%
      casesPerMillion: Math.floor(Math.random() * 50000) + 1000,
    }));
  }

  async getGlobalSummary(): Promise<GlobalSummary> {
    await this.delay(500); // Simulate network delay
    return {
      totalConfirmed: 650000000,
      totalDeaths: 6700000,
      totalRecovered: 620000000,
      newConfirmed: 15000,
      newDeaths: 85,
      newRecovered: 18000,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getCountries(): Promise<CountrySummary[]> {
    await this.delay(800);
    return this.generateMockCountries();
  }

  async getCountryDetail(): Promise<CountryDetail> {
    await this.delay(600);
    const countries = this.generateMockCountries();
    const baseCountry = countries[0];

    return {
      ...baseCountry,
      historicalData: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        confirmed: Math.floor(Math.random() * 10000) + 1000,
        deaths: Math.floor(Math.random() * 200) + 10,
        recovered: Math.floor(Math.random() * 9500) + 900,
      })),
      vaccinations: {
        totalVaccinations: Math.floor(Math.random() * 200000000) + 50000000,
        peopleVaccinated: Math.floor(Math.random() * 150000000) + 40000000,
        peopleFullyVaccinated: Math.floor(Math.random() * 100000000) + 30000000,
        dailyVaccinations: Math.floor(Math.random() * 500000) + 10000,
        vaccinationsPerHundred: Math.floor(Math.random() * 200) + 50,
      },
      testing: {
        totalTests: Math.floor(Math.random() * 500000000) + 100000000,
        testsPerMillion: Math.floor(Math.random() * 2000000) + 500000,
        positiveRate: Math.random() * 0.2, // 0-20%
        dailyTests: Math.floor(Math.random() * 1000000) + 50000,
      },
      hospitalizations: {
        currentHospitalizations: Math.floor(Math.random() * 50000) + 1000,
        currentICU: Math.floor(Math.random() * 10000) + 200,
        weeklyHospitalAdmissions: Math.floor(Math.random() * 5000) + 100,
        weeklyICUAdmissions: Math.floor(Math.random() * 1000) + 20,
      },
    };
  }

  async getHistoricalData(_countryCode: string, days: number = 30): Promise<HistoricalData[]> {
    await this.delay(400);
    return Array.from({ length: days }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      confirmed: Math.floor(Math.random() * 10000) + 1000,
      deaths: Math.floor(Math.random() * 200) + 10,
      recovered: Math.floor(Math.random() * 9500) + 900,
    }));
  }

  async getVaccinationData(): Promise<VaccinationData> {
    await this.delay(400);
    return {
      totalVaccinations: Math.floor(Math.random() * 200000000) + 50000000,
      peopleVaccinated: Math.floor(Math.random() * 150000000) + 40000000,
      peopleFullyVaccinated: Math.floor(Math.random() * 100000000) + 30000000,
      dailyVaccinations: Math.floor(Math.random() * 500000) + 10000,
      vaccinationsPerHundred: Math.floor(Math.random() * 200) + 50,
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public clearCache(): void {
    // Mock implementation
  }

  public getCacheInfo(): { size: number; keys: string[] } {
    return { size: 0, keys: [] };
  }
}

// Export the appropriate service based on environment
export const covidApiService = process.env.NODE_ENV === 'development'
  ? new MockCovidApiService()
  : new CovidApiService();

// Export classes for testing
export { CovidApiService, MockCovidApiService, ApiClient, ApiError }; 