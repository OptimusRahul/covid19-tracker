import { useState, useEffect, useCallback, useRef } from 'react';
import { covidApiService } from '../services/apiService';
import { useAppStore } from '../store/appStore';
import { normalizeError, shouldRetry, getRetryDelay } from '../utils/errorUtils';
import { config } from '../config/environment';
import type { CountrySummary, GlobalSummary, CountryDetail, HistoricalData } from '../types/api';

// Generic API hook interface
interface UseApiOptions<T> {
  initialData?: T;
  enabled?: boolean;
  refetchInterval?: number;
  retryCount?: number;
  cacheKey?: string;
  dependencies?: unknown[];
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  retryCount: number;
}

// Generic useApi hook
export const useApi = <T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions<T> = {}
) => {
  const {
    initialData = null,
    enabled = true,
    refetchInterval,
    retryCount = 3,
    dependencies = [],
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    lastUpdated: null,
    retryCount: 0,
  });

  const retryTimeoutRef = useRef<NodeJS.Timeout>();
  const intervalRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  const dependenciesRef = useRef(dependencies);
  dependenciesRef.current = dependencies;

  const fetchData = useCallback(async (isRetry = false) => {
    if (!enabled) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (!isRetry) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const data = await apiCall();
      setState(prev => ({
        ...prev,
        data,
        loading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
        retryCount: 0,
      }));

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error) {
      const normalizedError = normalizeError(error, 'useApi');

      if (shouldRetry(normalizedError, state.retryCount) && state.retryCount < retryCount) {
        const delay = getRetryDelay(state.retryCount);

        setState(prev => ({
          ...prev,
          retryCount: prev.retryCount + 1,
        }));

        retryTimeoutRef.current = setTimeout(() => {
          fetchData(true);
        }, delay);
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: normalizedError.message,
          retryCount: 0,
        }));

        if (onError) {
          onError(error as Error);
        }
      }
    }
  }, [apiCall, enabled, retryCount, onSuccess, onError, state.retryCount]);

  const refetch = useCallback(() => {
    setState(prev => ({ ...prev, retryCount: 0 }));
    fetchData();
  }, [fetchData]);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      lastUpdated: null,
      retryCount: 0,
    });
  }, [initialData]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData, ...dependencies]);

  useEffect(() => {
    if (refetchInterval && refetchInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchData();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [fetchData, refetchInterval]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    refetch,
    reset,
    isStale: state.lastUpdated &&
      (Date.now() - new Date(state.lastUpdated).getTime()) > config.api.refreshInterval,
  };
};

// Specific COVID data hooks
export const useCovidCountries = (options?: UseApiOptions<CountrySummary[]>) => {
  const { setCountries, setError } = useAppStore();

  return useApi(
    () => covidApiService.getCountries(),
    {
      ...options,
      refetchInterval: config.api.refreshInterval,
      onSuccess: (data) => {
        setCountries(data);
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        setError('countries', error.message);
        options?.onError?.(error);
      },
    }
  );
};

export const useCovidGlobalSummary = (options?: UseApiOptions<GlobalSummary>) => {
  const { setGlobalSummary, setError } = useAppStore();

  return useApi(
    () => covidApiService.getGlobalSummary(),
    {
      ...options,
      refetchInterval: config.api.refreshInterval,
      onSuccess: (data) => {
        setGlobalSummary(data);
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        setError('globalSummary', error.message);
        options?.onError?.(error);
      },
    }
  );
};

export const useCovidCountryDetail = (countryCode: string, options?: UseApiOptions<CountryDetail>) => {
  const { setError } = useAppStore();

  return useApi(
    () => covidApiService.getCountryDetail(countryCode),
    {
      ...options,
      enabled: !!countryCode && options?.enabled !== false,
      dependencies: [countryCode],
      onError: (error) => {
        setError('countryDetail', error.message);
        options?.onError?.(error);
      },
    }
  );
};

export const useCovidHistoricalData = (countryCode: string, days = 30, options?: UseApiOptions<HistoricalData[]>) => {
  return useApi(
    () => covidApiService.getHistoricalData(countryCode, days),
    {
      ...options,
      enabled: !!countryCode && options?.enabled !== false,
      dependencies: [countryCode, days],
    }
  );
};

// Mutation hook for write operations
interface UseMutationOptions<T, V> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onMutate?: (variables: V) => void;
}

export const useMutation = <T, V>(
  mutationFn: (variables: V) => Promise<T>,
  options: UseMutationOptions<T, V> = {}
) => {
  const [state, setState] = useState<{
    loading: boolean;
    error: string | null;
    data: T | null;
  }>({
    loading: false,
    error: null,
    data: null,
  });

  const mutate = useCallback(async (variables: V) => {
    setState({ loading: true, error: null, data: null });

    try {
      if (options.onMutate) {
        options.onMutate(variables);
      }

      const data = await mutationFn(variables);

      setState({ loading: false, error: null, data });

      if (options.onSuccess) {
        options.onSuccess(data);
      }

      return data;
    } catch (error) {
      const normalizedError = normalizeError(error, 'useMutation');

      setState({ loading: false, error: normalizedError.message, data: null });

      if (options.onError) {
        options.onError(error as Error);
      }

      throw error;
    }
  }, [mutationFn, options]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, data: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
};

// Optimistic update hook
export const useOptimisticUpdate = <T>(
  updateFn: (oldData: T | null, variables: unknown) => T
) => {
  const [optimisticData, setOptimisticData] = useState<T | null>(null);
  const [isOptimistic, setIsOptimistic] = useState(false);

  const updateOptimistically = useCallback((variables: unknown, currentData: T | null) => {
    const newData = updateFn(currentData, variables);
    setOptimisticData(newData);
    setIsOptimistic(true);
    return newData;
  }, [updateFn]);

  const revertOptimistic = useCallback(() => {
    setOptimisticData(null);
    setIsOptimistic(false);
  }, []);

  const commitOptimistic = useCallback(() => {
    setIsOptimistic(false);
  }, []);

  return {
    optimisticData,
    isOptimistic,
    updateOptimistically,
    revertOptimistic,
    commitOptimistic,
  };
};

// Pagination hook
export const usePagination = <T>(
  data: T[],
  itemsPerPage: number = 10
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    totalPages,
    currentData,
    nextPage,
    prevPage,
    goToPage,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
};

// Infinite scroll hook
export const useInfiniteScroll = <T>(
  fetchMore: (page: number) => Promise<T[]>,
  options: {
    threshold?: number;
    enabled?: boolean;
    initialPage?: number;
  } = {}
) => {
  const { threshold = 100, enabled = true, initialPage = 1 } = options;

  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore || !enabled) return;

    setLoading(true);
    setError(null);

    try {
      const newData = await fetchMore(page);

      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setData(prev => [...prev, ...newData]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      const normalizedError = normalizeError(error, 'useInfiniteScroll');
      setError(normalizedError.message);
    } finally {
      setLoading(false);
    }
  }, [fetchMore, loading, hasMore, enabled, page]);

  const reset = useCallback(() => {
    setData([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
  }, [initialPage]);

  // Scroll detection
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore, threshold, enabled]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    reset,
  };
};

// Search hook with debouncing
export const useSearch = <T>(
  searchFn: (query: string) => T[],
  data: T[],
  options: {
    debounceMs?: number;
    minLength?: number;
    enabled?: boolean;
  } = {}
) => {
  const { debounceMs = 300, minLength = 2, enabled = true } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();

  const search = useCallback((searchQuery: string) => {
    if (!enabled || searchQuery.length < minLength) {
      setResults([]);
      return;
    }

    setLoading(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      try {
        const searchResults = searchFn(searchQuery);
        setResults(searchResults);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);
  }, [searchFn, enabled, minLength, debounceMs]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
    search(newQuery);
  }, [search]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    search(query);
  }, [data, search, query]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return {
    query,
    results,
    loading,
    updateQuery,
    clearSearch,
    hasResults: results.length > 0,
    isEmpty: query.length >= minLength && results.length === 0,
  };
}; 