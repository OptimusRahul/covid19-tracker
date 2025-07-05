import { DATE_FORMATS } from '../constants';

// Number formatting utilities
export const formatNumber = (num: number, options?: Intl.NumberFormatOptions): string => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  const defaultOptions: Intl.NumberFormatOptions = {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  };
  
  return new Intl.NumberFormat('en-US', { ...defaultOptions, ...options }).format(num);
};

export const formatLargeNumber = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) return '0';
  
  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (abs >= 1_000_000_000) {
    return sign + (abs / 1_000_000_000).toFixed(1) + 'B';
  } else if (abs >= 1_000_000) {
    return sign + (abs / 1_000_000).toFixed(1) + 'M';
  } else if (abs >= 1_000) {
    return sign + (abs / 1_000).toFixed(1) + 'K';
  } else {
    return num.toString();
  }
};

export const formatPercentage = (value: number, total: number, decimals = 2): string => {
  if (total === 0 || isNaN(value) || isNaN(total)) return '0%';
  const percentage = (value / total) * 100;
  return `${percentage.toFixed(decimals)}%`;
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Date formatting utilities
export const formatDate = (date: Date | string, format: keyof typeof DATE_FORMATS = 'SHORT'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  if (format === 'RELATIVE') {
    return formatRelativeTime(dateObj);
  }
  
  // For now, return a simple format - in a real app, you'd use a library like date-fns
  return dateObj.toLocaleDateString('en-US', getDateFormatOptions(format));
};

const getDateFormatOptions = (format: keyof typeof DATE_FORMATS): Intl.DateTimeFormatOptions => {
  switch (format) {
    case 'SHORT':
      return { month: 'short', day: 'numeric', year: 'numeric' };
    case 'MEDIUM':
      return { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' };
    case 'LONG':
      return { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', second: '2-digit' };
    case 'ISO':
      return { year: 'numeric', month: '2-digit', day: '2-digit' };
    default:
      return { month: 'short', day: 'numeric', year: 'numeric' };
  }
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

export const formatTimeAgo = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatRelativeTime(dateObj);
};

export const formatDateRange = (startDate: Date | string, endDate: Date | string): string => {
  const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';
  
  const startFormatted = formatDate(start, 'SHORT');
  const endFormatted = formatDate(end, 'SHORT');
  
  return `${startFormatted} - ${endFormatted}`;
};

// Text formatting utilities
export const truncateText = (text: string, maxLength: number, suffix = '...'): string => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + suffix;
};

export const capitalizeFirst = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const sanitizeHtml = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// COVID-19 specific formatting
export const formatCovidNumber = (num: number): string => {
  return formatNumber(num, { useGrouping: true });
};

export const formatCovidRate = (rate: number): string => {
  if (typeof rate !== 'number' || isNaN(rate)) return '0.00%';
  return `${(rate * 100).toFixed(2)}%`;
};

export const formatCasesPerMillion = (cases: number, population: number): string => {
  if (!population || population === 0) return '0';
  const casesPerMillion = (cases / population) * 1_000_000;
  return formatNumber(casesPerMillion, { maximumFractionDigits: 0 });
};

export const formatGrowthRate = (current: number, previous: number): string => {
  if (previous === 0) return '+∞%';
  const growth = ((current - previous) / previous) * 100;
  const sign = growth > 0 ? '+' : '';
  return `${sign}${growth.toFixed(1)}%`;
};

// Color utilities for data visualization
export const getColorForValue = (value: number, max: number, colorScheme: 'cases' | 'deaths' | 'recovered' = 'cases'): string => {
  const intensity = Math.min(value / max, 1);
  
  const colorSchemes = {
    cases: {
      low: 'rgba(59, 130, 246, 0.3)',  // Blue
      medium: 'rgba(245, 158, 11, 0.6)', // Amber
      high: 'rgba(239, 68, 68, 0.8)',   // Red
    },
    deaths: {
      low: 'rgba(107, 114, 128, 0.3)',  // Gray
      medium: 'rgba(239, 68, 68, 0.6)', // Red
      high: 'rgba(153, 27, 27, 0.8)',   // Dark Red
    },
    recovered: {
      low: 'rgba(34, 197, 94, 0.3)',   // Green
      medium: 'rgba(34, 197, 94, 0.6)', // Green
      high: 'rgba(34, 197, 94, 0.8)',   // Green
    },
  };
  
  const colors = colorSchemes[colorScheme];
  
  if (intensity < 0.3) return colors.low;
  if (intensity < 0.7) return colors.medium;
  return colors.high;
};

export const getRiskLevel = (cases: number, population: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (!population || population === 0) return 'low';
  
  const casesPerMillion = (cases / population) * 1_000_000;
  
  if (casesPerMillion < 1000) return 'low';
  if (casesPerMillion < 5000) return 'medium';  
  if (casesPerMillion < 20000) return 'high';
  return 'critical';
};

export const getRiskLevelColor = (level: 'low' | 'medium' | 'high' | 'critical'): string => {
  const colors = {
    low: '#10b981',     // Green
    medium: '#f59e0b',  // Amber
    high: '#fb923c',    // Orange
    critical: '#ef4444' // Red
  };
  
  return colors[level];
};

// Validation utilities
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
  return phoneRegex.test(phone);
};

// Data transformation utilities
export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = (item[key] as unknown) as string;
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterBy = <T>(array: T[], predicate: (item: T) => boolean): T[] => {
  return array.filter(predicate);
};

// Array utilities
export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const unique = <T>(array: T[]): T[] => {
  return [...new Set(array)];
};

export const uniqueBy = <T, K extends keyof T>(array: T[], key: K): T[] => {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

// Performance utilities
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Local storage utilities
export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: (): boolean => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
}; 