import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Number formatting utilities
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

export function formatLargeNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

// Date formatting utilities
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) {
    return '1 day ago';
  }
  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  const months = Math.floor(diffDays / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
}

// Color utilities for COVID stats
export function getStatColor(statType: 'confirmed' | 'deaths' | 'recovered' | 'active'): string {
  switch (statType) {
    case 'confirmed':
      return 'text-red-500';
    case 'deaths':
      return 'text-gray-600 dark:text-gray-400';
    case 'recovered':
      return 'text-green-500';
    case 'active':
      return 'text-orange-500';
    default:
      return 'text-foreground';
  }
}

export function getStatBgColor(statType: 'confirmed' | 'deaths' | 'recovered' | 'active'): string {
  switch (statType) {
    case 'confirmed':
      return 'bg-red-50 dark:bg-red-950/20';
    case 'deaths':
      return 'bg-gray-50 dark:bg-gray-950/20';
    case 'recovered':
      return 'bg-green-50 dark:bg-green-950/20';
    case 'active':
      return 'bg-orange-50 dark:bg-orange-950/20';
    default:
      return 'bg-card';
  }
} 