import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import { CountrySummary } from '../types/api';
import { FilterState, Theme, LoadingState } from '../types/ui';
import { UserPreferences } from '../types/global';
import { STORAGE_KEYS, REGIONS, SORT_FIELDS, SORT_DIRECTIONS } from '../constants';

// Application State Interface
interface AppState {
  // Core data
  countries: CountrySummary[];
  globalSummary: {
    totalConfirmed: number;
    totalDeaths: number;
    totalRecovered: number;
    newConfirmed: number;
    newDeaths: number;
    newRecovered: number;
    lastUpdated: string;
  };
  
  // Loading states
  loading: {
    countries: LoadingState;
    globalSummary: LoadingState;
    countryDetail: LoadingState;
  };
  
  // Error states
  errors: {
    countries: string | null;
    globalSummary: string | null;
    countryDetail: string | null;
  };
  
  // UI state
  ui: {
    theme: Theme;
    sidebarOpen: boolean;
    selectedCountry: string | null;
    showCountryDetail: boolean;
    showComparison: boolean;
    searchQuery: string;
    filters: FilterState;
  };
  
  // User data
  user: {
    favorites: string[];
    comparisonCountries: string[];
    preferences: UserPreferences;
  };
  
  // Cache
  cache: {
    lastUpdated: number;
    countriesTimestamp: number;
    globalSummaryTimestamp: number;
  };
}

// Actions Interface
interface AppActions {
  // Data actions
  setCountries: (countries: CountrySummary[]) => void;
  setGlobalSummary: (summary: AppState['globalSummary']) => void;
  addCountry: (country: CountrySummary) => void;
  updateCountry: (countryCode: string, updates: Partial<CountrySummary>) => void;
  
  // Loading actions
  setLoading: (key: keyof AppState['loading'], state: LoadingState) => void;
  setError: (key: keyof AppState['errors'], error: string | null) => void;
  clearErrors: () => void;
  
  // UI actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSelectedCountry: (countryCode: string | null) => void;
  setShowCountryDetail: (show: boolean) => void;
  setShowComparison: (show: boolean) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
  
  // User actions
  toggleFavorite: (countryCode: string) => void;
  addToComparison: (countryCode: string) => void;
  removeFromComparison: (countryCode: string) => void;
  clearComparison: () => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // Cache actions
  updateCache: (key: keyof AppState['cache'], timestamp: number) => void;
  isCacheValid: (key: keyof AppState['cache'], maxAge: number) => boolean;
  
  // Computed getters
  getFilteredCountries: () => CountrySummary[];
  getFavoriteCountries: () => CountrySummary[];
  getComparisonCountries: () => CountrySummary[];
  getCountryByCode: (code: string) => CountrySummary | undefined;
  
  // Utility actions
  reset: () => void;
  hydrate: () => void;
}

// Combined store type
type AppStore = AppState & AppActions;

// Default state
const defaultState: AppState = {
  countries: [],
  globalSummary: {
    totalConfirmed: 0,
    totalDeaths: 0,
    totalRecovered: 0,
    newConfirmed: 0,
    newDeaths: 0,
    newRecovered: 0,
    lastUpdated: new Date().toISOString(),
  },
  loading: {
    countries: 'idle',
    globalSummary: 'idle',
    countryDetail: 'idle',
  },
  errors: {
    countries: null,
    globalSummary: null,
    countryDetail: null,
  },
  ui: {
    theme: 'system',
    sidebarOpen: true,
    selectedCountry: null,
    showCountryDetail: false,
    showComparison: false,
    searchQuery: '',
    filters: {
      selectedRegion: REGIONS.ALL as FilterState['selectedRegion'],
      sortField: SORT_FIELDS.CONFIRMED as FilterState['sortField'],
      sortDirection: SORT_DIRECTIONS.DESC as FilterState['sortDirection'],
      searchQuery: '',
    },
  },
  user: {
    favorites: [],
    comparisonCountries: [],
    preferences: {
      theme: 'system',
      language: 'en',
      favorites: [],
      comparisonCountries: [],
      filters: {
        region: REGIONS.ALL,
        sortField: SORT_FIELDS.CONFIRMED,
        sortDirection: SORT_DIRECTIONS.DESC,
      },
      ui: {
        sidebarCollapsed: false,
        mapHeight: 320,
        autoRefresh: true,
      },
    },
  },
  cache: {
    lastUpdated: Date.now(),
    countriesTimestamp: 0,
    globalSummaryTimestamp: 0,
  },
};

// Create store with middleware
export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...defaultState,
        
        // Data actions
        setCountries: (countries) => {
          set((state) => {
            state.countries = countries;
            state.loading.countries = 'success';
            state.errors.countries = null;
            state.cache.countriesTimestamp = Date.now();
          });
        },
        
        setGlobalSummary: (summary) => {
          set((state) => {
            state.globalSummary = summary;
            state.loading.globalSummary = 'success';
            state.errors.globalSummary = null;
            state.cache.globalSummaryTimestamp = Date.now();
          });
        },
        
        addCountry: (country) => {
          set((state) => {
            const existingIndex = state.countries.findIndex((c: CountrySummary) => c.countryCode === country.countryCode);
            if (existingIndex !== -1) {
              state.countries[existingIndex] = country;
            } else {
              state.countries.push(country);
            }
          });
        },
        
        updateCountry: (countryCode, updates) => {
          set((state) => {
            const index = state.countries.findIndex((c: CountrySummary) => c.countryCode === countryCode);
            if (index !== -1) {
              Object.assign(state.countries[index], updates);
            }
          });
        },
        
        // Loading actions
        setLoading: (key, loadingState) => {
          set((state) => {
            state.loading[key] = loadingState;
          });
        },
        
        setError: (key, error) => {
          set((state) => {
            state.errors[key] = error;
            if (error) {
              state.loading[key] = 'error';
            }
          });
        },
        
        clearErrors: () => {
          set((state) => {
            state.errors = {
              countries: null,
              globalSummary: null,
              countryDetail: null,
            };
          });
        },
        
        // UI actions
        setTheme: (theme) => {
          set((state) => {
            state.ui.theme = theme;
            state.user.preferences.theme = theme;
          });
        },
        
        toggleSidebar: () => {
          set((state) => {
            state.ui.sidebarOpen = !state.ui.sidebarOpen;
            state.user.preferences.ui.sidebarCollapsed = !state.ui.sidebarOpen;
          });
        },
        
        setSelectedCountry: (countryCode) => {
          set((state) => {
            state.ui.selectedCountry = countryCode;
          });
        },
        
        setShowCountryDetail: (show) => {
          set((state) => {
            state.ui.showCountryDetail = show;
          });
        },
        
        setShowComparison: (show) => {
          set((state) => {
            state.ui.showComparison = show;
          });
        },
        
        setSearchQuery: (query) => {
          set((state) => {
            state.ui.searchQuery = query;
            state.ui.filters.searchQuery = query;
          });
        },
        
        setFilters: (filters) => {
          set((state) => {
            Object.assign(state.ui.filters, filters);
          });
        },
        
        resetFilters: () => {
          set((state) => {
            state.ui.filters = {
              selectedRegion: REGIONS.ALL as FilterState['selectedRegion'],
              sortField: SORT_FIELDS.CONFIRMED as FilterState['sortField'],
              sortDirection: SORT_DIRECTIONS.DESC as FilterState['sortDirection'],
              searchQuery: '',
            };
            state.ui.searchQuery = '';
          });
        },
        
        // User actions
        toggleFavorite: (countryCode) => {
          set((state) => {
            const index = state.user.favorites.indexOf(countryCode);
            if (index !== -1) {
              state.user.favorites.splice(index, 1);
            } else {
              state.user.favorites.push(countryCode);
            }
            state.user.preferences.favorites = [...state.user.favorites];
          });
        },
        
        addToComparison: (countryCode) => {
          set((state) => {
            if (!state.user.comparisonCountries.includes(countryCode) && 
                state.user.comparisonCountries.length < 3) {
              state.user.comparisonCountries.push(countryCode);
              state.user.preferences.comparisonCountries = [...state.user.comparisonCountries];
            }
          });
        },
        
        removeFromComparison: (countryCode) => {
          set((state) => {
            const index = state.user.comparisonCountries.indexOf(countryCode);
            if (index !== -1) {
              state.user.comparisonCountries.splice(index, 1);
              state.user.preferences.comparisonCountries = [...state.user.comparisonCountries];
            }
          });
        },
        
        clearComparison: () => {
          set((state) => {
            state.user.comparisonCountries = [];
            state.user.preferences.comparisonCountries = [];
          });
        },
        
        updatePreferences: (preferences) => {
          set((state) => {
            Object.assign(state.user.preferences, preferences);
          });
        },
        
        // Cache actions
        updateCache: (key, timestamp) => {
          set((state) => {
            state.cache[key] = timestamp;
          });
        },
        
        isCacheValid: (key, maxAge) => {
          const state = get();
          const timestamp = state.cache[key];
          return timestamp > 0 && (Date.now() - timestamp) < maxAge;
        },
        
        // Computed getters
        getFilteredCountries: () => {
          const state = get();
          const { countries, ui } = state;
          const { filters } = ui;
          
          return countries
            .filter(country => {
              // Region filter
              if (filters.selectedRegion !== REGIONS.ALL && country.region !== filters.selectedRegion) {
                return false;
              }
              
              // Search filter
              if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                return country.country.toLowerCase().includes(query) ||
                       country.countryCode.toLowerCase().includes(query);
              }
              
              return true;
            })
            .sort((a, b) => {
              const { sortField, sortDirection } = filters;
              const aValue = a[sortField as keyof CountrySummary];
              const bValue = b[sortField as keyof CountrySummary];
              
              // Handle string comparisons
              if (typeof aValue === 'string' && typeof bValue === 'string') {
                const aStr = aValue.toLowerCase();
                const bStr = bValue.toLowerCase();
                const comparison = aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
                return sortDirection === SORT_DIRECTIONS.ASC ? comparison : -comparison;
              }
              
              // Handle numeric comparisons
              if (typeof aValue === 'number' && typeof bValue === 'number') {
                const comparison = aValue - bValue;
                return sortDirection === SORT_DIRECTIONS.ASC ? comparison : -comparison;
              }
              
              // Fallback for other types - convert to string
              const aStr = String(aValue || '').toLowerCase();
              const bStr = String(bValue || '').toLowerCase();
              const comparison = aStr > bStr ? 1 : aStr < bStr ? -1 : 0;
              return sortDirection === SORT_DIRECTIONS.ASC ? comparison : -comparison;
            });
        },
        
        getFavoriteCountries: () => {
          const state = get();
          return state.countries.filter(country => 
            state.user.favorites.includes(country.countryCode)
          );
        },
        
        getComparisonCountries: () => {
          const state = get();
          return state.countries.filter(country => 
            state.user.comparisonCountries.includes(country.countryCode)
          );
        },
        
        getCountryByCode: (code) => {
          const state = get();
          return state.countries.find(country => country.countryCode === code);
        },
        
        // Utility actions
        reset: () => {
          set(defaultState);
        },
        
        hydrate: () => {
          // This will be called after the store is hydrated from localStorage
          console.log('Store hydrated');
        },
      })),
      {
        name: STORAGE_KEYS.USER_PREFERENCES,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          user: state.user,
          ui: {
            theme: state.ui.theme,
            sidebarOpen: state.ui.sidebarOpen,
            filters: state.ui.filters,
          },
        }),
      }
    ),
    {
      name: 'covid-tracker-store',
    }
  )
);

// Selectors for better performance
export const useCountries = () => useAppStore((state) => state.countries);
export const useGlobalSummary = () => useAppStore((state) => state.globalSummary);
export const useLoading = () => useAppStore((state) => state.loading);
export const useErrors = () => useAppStore((state) => state.errors);
export const useUI = () => useAppStore((state) => state.ui);
export const useUser = () => useAppStore((state) => state.user);
export const useFilters = () => useAppStore((state) => state.ui.filters);
export const useTheme = () => useAppStore((state) => state.ui.theme);
export const useFavorites = () => useAppStore((state) => state.user.favorites);
export const useComparisonCountries = () => useAppStore((state) => state.user.comparisonCountries);

// Action selectors
export const useAppActions = () => useAppStore((state) => ({
  setCountries: state.setCountries,
  setGlobalSummary: state.setGlobalSummary,
  setLoading: state.setLoading,
  setError: state.setError,
  clearErrors: state.clearErrors,
  setTheme: state.setTheme,
  toggleSidebar: state.toggleSidebar,
  setSelectedCountry: state.setSelectedCountry,
  setShowCountryDetail: state.setShowCountryDetail,
  setShowComparison: state.setShowComparison,
  setSearchQuery: state.setSearchQuery,
  setFilters: state.setFilters,
  resetFilters: state.resetFilters,
  toggleFavorite: state.toggleFavorite,
  addToComparison: state.addToComparison,
  removeFromComparison: state.removeFromComparison,
  clearComparison: state.clearComparison,
  getFilteredCountries: state.getFilteredCountries,
  getFavoriteCountries: state.getFavoriteCountries,
  getComparisonCountries: state.getComparisonCountries,
  getCountryByCode: state.getCountryByCode,
})); 