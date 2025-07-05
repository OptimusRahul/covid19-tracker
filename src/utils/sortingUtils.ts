import type { CountrySummary } from '@/types/covid';

export type SortField = 'country' | 'confirmed' | 'deaths' | 'recovered' | 'active' | 'deathRate' | 'recoveryRate';
export type SortDirection = 'asc' | 'desc';

// Helper function to sort countries
export function sortCountries(
  countries: CountrySummary[], 
  sortField: SortField, 
  sortDirection: SortDirection
): CountrySummary[] {
  return [...countries].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;
    
    switch (sortField) {
      case 'country':
        aValue = a.country.toLowerCase();
        bValue = b.country.toLowerCase();
        break;
      case 'confirmed':
        aValue = a.confirmed || 0;
        bValue = b.confirmed || 0;
        break;
      case 'deaths':
        aValue = a.deaths || 0;
        bValue = b.deaths || 0;
        break;
      case 'recovered':
        aValue = a.recovered || 0;
        bValue = b.recovered || 0;
        break;
      case 'active':
        aValue = a.active || 0;
        bValue = b.active || 0;
        break;
      case 'deathRate':
        aValue = a.confirmed > 0 ? (a.deaths / a.confirmed) * 100 : 0;
        bValue = b.confirmed > 0 ? (b.deaths / b.confirmed) * 100 : 0;
        break;
      case 'recoveryRate':
        aValue = a.confirmed > 0 ? (a.recovered / a.confirmed) * 100 : 0;
        bValue = b.confirmed > 0 ? (b.recovered / b.confirmed) * 100 : 0;
        break;
      default:
        aValue = a.confirmed || 0;
        bValue = b.confirmed || 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
} 