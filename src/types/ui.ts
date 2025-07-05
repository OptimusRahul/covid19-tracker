import { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  testId?: string;
  children?: ReactNode;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';

// Filter and sorting types
export type SortField = 'country' | 'confirmed' | 'deaths' | 'recovered' | 'active' | 'deathRate' | 'recoveryRate';
export type SortDirection = 'asc' | 'desc';
export type Region = 'all' | 'asia' | 'europe' | 'north-america' | 'south-america' | 'africa' | 'oceania';

export interface FilterState {
  selectedRegion: Region;
  sortField: SortField;
  sortDirection: SortDirection;
  searchQuery: string;
}

// Modal types
export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Chart types
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface ChartProps extends BaseComponentProps {
  data: ChartDataPoint[];
  title: string;
  color: string;
  height?: number;
  showLegend?: boolean;
  animated?: boolean;
}

// Map types
export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  size: number;
  color: string;
  data: Record<string, unknown>;
}

export interface MapProps extends BaseComponentProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  height?: number;
  onMarkerClick?: (marker: MapMarker) => void;
}

// Form types
export interface FormFieldProps extends BaseComponentProps {
  name: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

// Button variants
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

// Toast types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  children?: NavigationItem[];
  disabled?: boolean;
}

// Error types
export interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorBoundary?: boolean;
}

// Responsive breakpoints
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// Animation types
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  direction?: 'in' | 'out' | 'in-out';
} 