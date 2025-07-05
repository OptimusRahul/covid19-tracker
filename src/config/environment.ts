interface AppConfig {
  api: {
    baseURL: string;
    timeout: number;
    retryAttempts: number;
    refreshInterval: number;
  };
  ui: {
    mapHeight: number;
    maxComparisonCountries: number;
    skeletonAnimationDuration: number;
    toastDuration: number;
  };
  features: {
    enableExport: boolean;
    enableKeyboardShortcuts: boolean;
    enablePWA: boolean;
    enableAnalytics: boolean;
  };
  storage: {
    favoritesKey: string;
    preferencesKey: string;
    cachePrefix: string;
  };
}

export const config: AppConfig = {
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://api.api-ninjas.com/v1',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '10000'),
    retryAttempts: parseInt(process.env.REACT_APP_RETRY_ATTEMPTS || '3'),
    refreshInterval: parseInt(process.env.REACT_APP_REFRESH_INTERVAL || '900000'), // 15 minutes
  },
  ui: {
    mapHeight: parseInt(process.env.REACT_APP_MAP_HEIGHT || '320'),
    maxComparisonCountries: parseInt(process.env.REACT_APP_MAX_COMPARISON || '3'),
    skeletonAnimationDuration: 1500,
    toastDuration: 5000,
  },
  features: {
    enableExport: process.env.REACT_APP_ENABLE_EXPORT !== 'false',
    enableKeyboardShortcuts: process.env.REACT_APP_ENABLE_SHORTCUTS !== 'false',
    enablePWA: process.env.REACT_APP_ENABLE_PWA === 'true',
    enableAnalytics: process.env.NODE_ENV === 'production',
  },
  storage: {
    favoritesKey: 'covid-tracker-favorites',
    preferencesKey: 'covid-tracker-preferences',
    cachePrefix: 'covid-tracker-cache',
  },
};

// Type-safe environment variable access
export const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not defined`);
  }
  return value || defaultValue!;
};

// Development helpers
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test'; 