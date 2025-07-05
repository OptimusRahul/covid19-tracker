import { useState, useEffect, useCallback } from 'react';
import { safeLocalStorage } from '../utils/formatUtils';

// Type-safe localStorage hook
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
  options: {
    serializer?: {
      stringify: (value: T) => string;
      parse: (value: string) => T;
    };
    onError?: (error: Error) => void;
  } = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const { serializer = JSON, onError } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = safeLocalStorage.getItem(key);
      return item ? serializer.parse(item) : defaultValue;
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      safeLocalStorage.setItem(key, serializer.stringify(valueToStore));
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  }, [key, serializer, storedValue, onError]);

  const removeValue = useCallback(() => {
    try {
      safeLocalStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  }, [key, defaultValue, onError]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(serializer.parse(e.newValue));
        } catch (error) {
          if (onError) {
            onError(error as Error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, serializer, onError]);

  return [storedValue, setValue, removeValue];
};

// Session storage hook
export const useSessionStorage = <T>(
  key: string,
  defaultValue: T,
  options: {
    serializer?: {
      stringify: (value: T) => string;
      parse: (value: string) => T;
    };
    onError?: (error: Error) => void;
  } = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const { serializer = JSON, onError } = options;

  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? serializer.parse(item) : defaultValue;
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      sessionStorage.setItem(key, serializer.stringify(valueToStore));
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  }, [key, serializer, storedValue, onError]);

  const removeValue = useCallback(() => {
    try {
      sessionStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      if (onError) {
        onError(error as Error);
      }
    }
  }, [key, defaultValue, onError]);

  return [storedValue, setValue, removeValue];
};

// Persistent state hook with expiration
export const usePersistentState = <T>(
  key: string,
  defaultValue: T,
  ttl?: number // Time to live in milliseconds
): [T, (value: T | ((prev: T) => T)) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = safeLocalStorage.getItem(key);
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      
      // Check if item has expired
      if (ttl && parsed.timestamp && Date.now() - parsed.timestamp > ttl) {
        safeLocalStorage.removeItem(key);
        return defaultValue;
      }

      return parsed.value || defaultValue;
    } catch (error) {
      return defaultValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      const item = {
        value: valueToStore,
        timestamp: Date.now(),
      };
      setStoredValue(valueToStore);
      safeLocalStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Error setting persistent state:', error);
    }
  }, [key, storedValue]);

  const removeValue = useCallback(() => {
    try {
      safeLocalStorage.removeItem(key);
      setStoredValue(defaultValue);
    } catch (error) {
      console.error('Error removing persistent state:', error);
    }
  }, [key, defaultValue]);

  // Auto-cleanup expired items
  useEffect(() => {
    if (ttl) {
      const checkExpiration = () => {
        try {
          const item = safeLocalStorage.getItem(key);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed.timestamp && Date.now() - parsed.timestamp > ttl) {
              removeValue();
            }
          }
        } catch (error) {
          console.error('Error checking expiration:', error);
        }
      };

      const interval = setInterval(checkExpiration, ttl);
      return () => clearInterval(interval);
    }
  }, [key, ttl, removeValue]);

  return [storedValue, setValue, removeValue];
};

// Cache hook with automatic cleanup
export const useCache = <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    staleWhileRevalidate?: boolean;
    onError?: (error: Error) => void;
  } = {}
) => {
  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true, onError } = options; // Default 5 minutes
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCachedData = useCallback((): { data: T; timestamp: number } | null => {
    try {
      const cached = safeLocalStorage.getItem(`cache_${key}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        return parsed;
      }
    } catch (error) {
      console.error('Error getting cached data:', error);
    }
    return null;
  }, [key]);

  const setCachedData = useCallback((data: T) => {
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
      };
      safeLocalStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error setting cached data:', error);
    }
  }, [key]);

  const isStale = useCallback((timestamp: number): boolean => {
    return Date.now() - timestamp > ttl;
  }, [ttl]);

  const fetchData = useCallback(async (force = false) => {
    const cached = getCachedData();
    
    // Return cached data if valid and not forced
    if (cached && !isStale(cached.timestamp) && !force) {
      setData(cached.data);
      return cached.data;
    }

    // If we have stale data and staleWhileRevalidate is enabled, use it while fetching
    if (cached && staleWhileRevalidate && !force) {
      setData(cached.data);
    }

    setLoading(true);
    setError(null);

    try {
      const freshData = await fetcher();
      setData(freshData);
      setCachedData(freshData);
      return freshData;
    } catch (error) {
      const err = error as Error;
      setError(err);
      if (onError) {
        onError(err);
      }
      
      // If we have cached data and fetch failed, keep using cached data
      if (cached && !data) {
        setData(cached.data);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getCachedData, isStale, fetcher, staleWhileRevalidate, setCachedData, onError, data]);

  const invalidate = useCallback(() => {
    safeLocalStorage.removeItem(`cache_${key}`);
    setData(null);
  }, [key]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate,
    isStale: data ? isStale(Date.now()) : false,
  };
};

// Preferences hook
export const usePreferences = <T extends Record<string, unknown>>(
  key: string,
  defaultPreferences: T
) => {
  const [preferences, setPreferences, removePreferences] = useLocalStorage(
    key,
    defaultPreferences
  );

  const updatePreference = useCallback(<K extends keyof T>(
    preference: K,
    value: T[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: value,
    }));
  }, [setPreferences]);

  const resetPreferences = useCallback(() => {
    setPreferences(defaultPreferences);
  }, [setPreferences, defaultPreferences]);

  const getPreference = useCallback(<K extends keyof T>(
    preference: K
  ): T[K] => {
    return preferences[preference];
  }, [preferences]);

  return {
    preferences,
    updatePreference,
    resetPreferences,
    getPreference,
    removePreferences,
  };
};

// Theme persistence hook
export const useThemePersistence = () => {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'system'>('theme', 'system');

  const updateTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    // Apply theme to document
    const root = document.documentElement;
    
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', newTheme);
    }
  }, [setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return {
    theme,
    updateTheme,
  };
}; 