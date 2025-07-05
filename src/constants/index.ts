// Application Constants
export const APP_NAME = 'COVID-19 Global Tracker';
export const APP_VERSION = '2.0.0';
export const APP_DESCRIPTION = 'Real-time COVID-19 statistics and interactive global tracking';

// API Constants
export const API_ENDPOINTS = {
  GLOBAL_SUMMARY: '/covid19',
  COUNTRIES: '/covid19/countries',
  COUNTRY_DETAIL: '/covid19/country',
  HISTORICAL: '/covid19/historical',
  VACCINATIONS: '/covid19/vaccinations',
} as const;

export const API_DEFAULTS = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 900000, // 15 minutes
  REFRESH_INTERVAL: 60000, // 1 minute
  REQUEST_DELAY: 500,
} as const;

// UI Constants
export const UI_CONSTANTS = {
  MAP_HEIGHT: 320,
  SIDEBAR_WIDTH: 400,
  HEADER_HEIGHT: 64,
  FOOTER_HEIGHT: 40,
  SKELETON_ANIMATION_DURATION: 1500,
  TOAST_DURATION: 5000,
  MODAL_TRANSITION_DURATION: 300,
  LOADING_DEBOUNCE: 300,
} as const;

// Color Constants
export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4',
  
  // COVID-19 specific colors
  CONFIRMED: '#f59e0b',
  DEATHS: '#ef4444',
  RECOVERED: '#10b981',
  ACTIVE: '#3b82f6',
  
  // Risk levels
  RISK_LOW: '#10b981',
  RISK_MEDIUM: '#f59e0b',
  RISK_HIGH: '#fb923c',
  RISK_CRITICAL: '#ef4444',
} as const;

// Map Constants
export const MAP_CONSTANTS = {
  DEFAULT_CENTER: [20, 0] as [number, number],
  DEFAULT_ZOOM: 2,
  MIN_ZOOM: 1,
  MAX_ZOOM: 10,
  MARKER_SIZE_MIN: 4,
  MARKER_SIZE_MAX: 20,
  CLUSTER_THRESHOLD: 10,
  POPUP_MAX_WIDTH: 300,
} as const;

// Filter Constants
export const REGIONS = {
  ALL: 'all',
  ASIA: 'asia',
  EUROPE: 'europe',
  NORTH_AMERICA: 'north-america',
  SOUTH_AMERICA: 'south-america',
  AFRICA: 'africa',
  OCEANIA: 'oceania',
} as const;

export const SORT_FIELDS = {
  COUNTRY: 'country',
  CONFIRMED: 'confirmed',
  DEATHS: 'deaths',
  RECOVERED: 'recovered',
  ACTIVE: 'active',
  DEATH_RATE: 'deathRate',
  RECOVERY_RATE: 'recoveryRate',
} as const;

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// Limits and Thresholds
export const LIMITS = {
  MAX_SEARCH_RESULTS: 100,
  MAX_COMPARISON_COUNTRIES: 3,
  MAX_FAVORITE_COUNTRIES: 20,
  MAX_HISTORY_DAYS: 30,
  MIN_SEARCH_QUERY_LENGTH: 2,
  ITEMS_PER_PAGE: 50,
  VIRTUAL_LIST_OVERSCAN: 5,
} as const;

export const THRESHOLDS = {
  HIGH_CASES: 100000,
  CRITICAL_CASES: 1000000,
  HIGH_DEATH_RATE: 0.02, // 2%
  HIGH_RECOVERY_RATE: 0.95, // 95%
  POPULATION_DENSITY_HIGH: 300, // per km²
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'covid-tracker-preferences',
  FAVORITES: 'covid-tracker-favorites',
  COMPARISON_COUNTRIES: 'covid-tracker-comparison',
  THEME: 'covid-tracker-theme',
  CACHE_PREFIX: 'covid-tracker-cache',
  LAST_UPDATED: 'covid-tracker-last-updated',
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  SEARCH: '/',
  TOGGLE_THEME: 'ctrl+t',
  OPEN_COMPARISON: 'ctrl+c',
  EXPORT_DATA: 'ctrl+e',
  SHOW_HELP: '?',
  ESCAPE: 'escape',
  ENTER: 'enter',
} as const;

// Export Formats
export const EXPORT_FORMATS = {
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf',
  XLSX: 'xlsx',
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  MEDIUM: 'MMM d, yyyy, h:mm a',
  LONG: 'MMMM d, yyyy, h:mm:ss a',
  ISO: 'yyyy-MM-dd',
  RELATIVE: 'relative',
} as const;

// Animation Durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SKELETON: 1500,
  BOUNCE: 600,
} as const;

// Validation Constants
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_EMAIL_LENGTH: 254,
  MAX_NAME_LENGTH: 50,
  MAX_COMMENT_LENGTH: 1000,
  PHONE_REGEX: /^[+]?[\d\s\-()]{10,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  API_ERROR: 'Unable to fetch data from the server. Please try again.',
  DATA_NOT_FOUND: 'The requested data could not be found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  GENERIC_ERROR: 'An unexpected error occurred. Please try again.',
  RATE_LIMIT_ERROR: 'Too many requests. Please wait before trying again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully',
  EXPORT_COMPLETE: 'Export completed successfully',
  PREFERENCES_SAVED: 'Preferences saved successfully',
  FAVORITE_ADDED: 'Country added to favorites',
  FAVORITE_REMOVED: 'Country removed from favorites',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: 'enableAnalytics',
  ENABLE_PWA: 'enablePWA',
  ENABLE_EXPORT: 'enableExport',
  ENABLE_KEYBOARD_SHORTCUTS: 'enableKeyboardShortcuts',
  ENABLE_DARK_MODE: 'enableDarkMode',
  ENABLE_BETA_FEATURES: 'enableBetaFeatures',
} as const;

// Chart Constants
export const CHART_CONSTANTS = {
  DEFAULT_HEIGHT: 300,
  MIN_HEIGHT: 200,
  MAX_HEIGHT: 600,
  ANIMATION_DURATION: 1000,
  COLORS: [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ],
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
  LOADING: 9999,
} as const; 