// Global application types
export interface AppState {
  initialized: boolean;
  version: string;
  lastUpdated: string;
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  favorites: string[];
  comparisonCountries: string[];
  selectedCountry?: string;
  filters: {
    region: string;
    sortField: string;
    sortDirection: string;
  };
  ui: {
    sidebarCollapsed: boolean;
    mapHeight: number;
    autoRefresh: boolean;
  };
}

// Storage types
export interface StorageItem<T> {
  value: T;
  timestamp: number;
  expiry?: number;
}

// Event types
export interface AppEvent {
  type: string;
  payload?: unknown;
  timestamp: number;
  source?: string;
}

// Feature flags
export interface FeatureFlags {
  enableExport: boolean;
  enableKeyboardShortcuts: boolean;
  enablePWA: boolean;
  enableAnalytics: boolean;
  enableBetaFeatures: boolean;
}

// Analytics types
export interface AnalyticsEvent {
  name: string;
  category: string;
  properties?: Record<string, string | number | boolean>;
  timestamp: number;
}

// Error tracking
export interface ErrorReport {
  error: Error;
  context: {
    component?: string;
    action?: string;
    user?: string;
    timestamp: number;
    url: string;
    userAgent: string;
  };
  tags?: string[];
}

// Performance monitoring
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  tags?: Record<string, string>;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & Record<string, never>;

// API utilities
export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export interface RequestState<T> {
  data: T | null;
  status: RequestStatus;
  error: string | null;
}

// Function types
export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;
export type EventHandler<T = unknown> = (event: T) => void;

// Date and time utilities
export type DateFormat = 'short' | 'medium' | 'long' | 'relative' | 'iso';
export type TimeZone = string; // e.g., 'UTC', 'America/New_York'

// File types for exports
export type ExportFormat = 'csv' | 'json' | 'pdf' | 'xlsx';

export interface ExportOptions {
  format: ExportFormat;
  filename?: string;
  includeMetadata?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
} 