import { ERROR_MESSAGES } from '../constants';
import { ApiError } from '../services/apiService';

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  timestamp: string;
  stack?: string;
  context?: string;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Error classification
export const classifyError = (error: Error): ErrorSeverity => {
  if (error instanceof ApiError) {
    if (error.code === 'NETWORK_ERROR') return 'high';
    if (error.code === 'TIMEOUT_ERROR') return 'medium';
    if (error.code === 'RATE_LIMIT_ERROR') return 'medium';
    if (error.code === 'API_ERROR') return 'high';
    return 'medium';
  }

  if (error.name === 'ChunkLoadError') return 'high';
  if (error.name === 'TypeError') return 'medium';
  if (error.name === 'ReferenceError') return 'high';
  if (error.message.includes('Network')) return 'high';
  if (error.message.includes('fetch')) return 'medium';

  return 'medium';
};

// Error normalization
export const normalizeError = (error: unknown, context?: string): AppError => {
  const timestamp = new Date().toISOString();

  if (error instanceof ApiError) {
    return {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp,
      context,
    };
  }

  if (error instanceof Error) {
    return {
      code: error.name || 'UNKNOWN_ERROR',
      message: error.message || ERROR_MESSAGES.GENERIC_ERROR,
      timestamp,
      stack: error.stack,
      context,
    };
  }

  if (typeof error === 'string') {
    return {
      code: 'STRING_ERROR',
      message: error,
      timestamp,
      context,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: ERROR_MESSAGES.GENERIC_ERROR,
    timestamp,
    details: { originalError: error },
    context,
  };
};

// User-friendly error messages
export const getUserFriendlyMessage = (error: AppError): string => {
  const errorCodeMap: Record<string, string> = {
    NETWORK_ERROR: 'Connection problem. Please check your internet connection and try again.',
    TIMEOUT_ERROR: 'Request timed out. Please try again in a moment.',
    RATE_LIMIT_ERROR: 'Too many requests. Please wait a moment before trying again.',
    API_ERROR: 'Service temporarily unavailable. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    DATA_NOT_FOUND: 'The requested information is not available.',
    GENERIC_ERROR: 'Something went wrong. Please try again.',
    ChunkLoadError: 'Failed to load application resources. Please refresh the page.',
    TypeError: 'An unexpected error occurred. Please refresh the page.',
    ReferenceError: 'Application error. Please refresh the page.',
  };

  return errorCodeMap[error.code] || error.message || ERROR_MESSAGES.GENERIC_ERROR;
};

// Error retry logic
export const shouldRetry = (error: AppError, attemptCount: number): boolean => {
  const maxRetries = 3;
  
  if (attemptCount >= maxRetries) return false;

  const retryableErrors = [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'RATE_LIMIT_ERROR',
    'API_ERROR',
  ];

  return retryableErrors.includes(error.code);
};

// Calculate retry delay with exponential backoff
export const getRetryDelay = (attemptCount: number): number => {
  const baseDelay = 1000; // 1 second
  const maxDelay = 10000; // 10 seconds
  
  return Math.min(baseDelay * Math.pow(2, attemptCount), maxDelay);
};

// Error reporting
export const reportError = (error: AppError, additionalContext?: Record<string, unknown>) => {
  const errorReport = {
    ...error,
    url: window.location.href,
    userAgent: navigator.userAgent,
    additionalContext,
    sessionId: getSessionId(),
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Report:', errorReport);
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Sentry, LogRocket, etc.
    sendToErrorService(errorReport);
  }
};

// Error recovery suggestions
export const getRecoveryActions = (error: AppError): Array<{
  label: string;
  action: () => void;
  primary?: boolean;
}> => {
  const actions: Array<{ label: string; action: () => void; primary?: boolean }> = [];

  // Common recovery actions
  if (error.code === 'NETWORK_ERROR') {
    actions.push({
      label: 'Check Connection',
      action: () => window.open('https://www.google.com', '_blank'),
    });
  }

  if (['TIMEOUT_ERROR', 'RATE_LIMIT_ERROR'].includes(error.code)) {
    actions.push({
      label: 'Try Again',
      action: () => window.location.reload(),
      primary: true,
    });
  }

  if (error.code === 'ChunkLoadError') {
    actions.push({
      label: 'Refresh Page',
      action: () => window.location.reload(),
      primary: true,
    });
  }

  // Always provide refresh option
  actions.push({
    label: 'Refresh Page',
    action: () => window.location.reload(),
  });

  // Always provide home option
  actions.push({
    label: 'Go Home',
    action: () => window.location.href = '/',
  });

  return actions;
};

// Session management for error tracking
let sessionId: string | null = null;

const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
};

// Mock error service (replace with actual service)
const sendToErrorService = (errorReport: Record<string, unknown>) => {
  // Example implementation
  // fetch('/api/errors', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(errorReport),
  // });
  
  console.log('Error sent to service:', errorReport);
};

// Error boundary helpers
export const createErrorBoundaryLogger = (componentName: string) => {
  return (error: Error, errorInfo: React.ErrorInfo) => {
    const appError = normalizeError(error, componentName);
    reportError(appError, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
  };
};

// Network error detection
export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return error.message.includes('fetch') ||
           error.message.includes('network') ||
           error.message.includes('Failed to fetch') ||
           error.name === 'NetworkError';
  }
  return false;
};

// Async error handler
export const handleAsyncError = async <T>(
  asyncFn: () => Promise<T>,
  context?: string,
  onError?: (error: AppError) => void
): Promise<T | null> => {
  try {
    return await asyncFn();
  } catch (error) {
    const appError = normalizeError(error, context);
    
    if (onError) {
      onError(appError);
    } else {
      reportError(appError);
    }
    
    return null;
  }
};

// Error validation
export const validateError = (error: unknown): error is Error => {
  return error instanceof Error && typeof error.message === 'string';
};

// Error aggregation for bulk reporting
class ErrorAggregator {
  private errors: AppError[] = [];
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(private flushIntervalMs: number = 5000) {
    this.startFlushTimer();
  }

  add(error: AppError) {
    this.errors.push(error);
    
    // Auto-flush on critical errors
    const tempError = new Error(error.message);
    tempError.name = error.code;
    if (classifyError(tempError) === 'critical') {
      this.flush();
    }
  }

  private startFlushTimer() {
    this.flushInterval = setInterval(() => {
      if (this.errors.length > 0) {
        this.flush();
      }
    }, this.flushIntervalMs);
  }

  private flush() {
    if (this.errors.length === 0) return;

    const errorsToFlush = [...this.errors];
    this.errors = [];

    // Send batch to error service
    sendToErrorService({
      type: 'batch',
      errors: errorsToFlush,
      timestamp: new Date().toISOString(),
    });
  }

  destroy() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush(); // Flush remaining errors
  }
}

// Export singleton aggregator
export const errorAggregator = new ErrorAggregator();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  errorAggregator.destroy();
}); 