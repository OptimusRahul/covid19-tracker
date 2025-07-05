import { useState, useMemo } from 'react';
import { Search, MapPin, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatLargeNumber } from '@/lib/utils';
import type { CountrySummary } from '@/types/covid';

interface CountryListProps {
  countries: CountrySummary[];
  selectedCountry?: string;
  onCountrySelect: (country: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function CountryList({
  countries,
  selectedCountry,
  onCountrySelect,
  isLoading = false,
  className,
}: CountryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'confirmed' | 'deaths' | 'recovered'>('confirmed');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedCountries = useMemo(() => {
    const filtered = countries.filter(country =>
      country.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.country;
          bValue = b.country;
          break;
        case 'confirmed':
          aValue = a.confirmed;
          bValue = b.confirmed;
          break;
        case 'deaths':
          aValue = a.deaths;
          bValue = b.deaths;
          break;
        case 'recovered':
          aValue = a.recovered;
          bValue = b.recovered;
          break;
        default:
          aValue = a.confirmed;
          bValue = b.confirmed;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return sortOrder === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      }
    });

    return filtered;
  }, [countries, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Countries</CardTitle>
          <CardDescription>Loading country data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Countries
        </CardTitle>
        <CardDescription>
          Click on a country to view detailed statistics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('name')}
            className="text-xs"
          >
            Name
            {sortBy === 'name' && (
              sortOrder === 'asc' ? <TrendingUp className="ml-1 h-3 w-3" /> : <TrendingDown className="ml-1 h-3 w-3" />
            )}
          </Button>
          <Button
            variant={sortBy === 'confirmed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('confirmed')}
            className="text-xs"
          >
            Cases
            {sortBy === 'confirmed' && (
              sortOrder === 'asc' ? <TrendingUp className="ml-1 h-3 w-3" /> : <TrendingDown className="ml-1 h-3 w-3" />
            )}
          </Button>
          <Button
            variant={sortBy === 'deaths' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleSort('deaths')}
            className="text-xs"
          >
            Deaths
            {sortBy === 'deaths' && (
              sortOrder === 'asc' ? <TrendingUp className="ml-1 h-3 w-3" /> : <TrendingDown className="ml-1 h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Countries List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAndSortedCountries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No countries found matching your search.</p>
            </div>
          ) : (
            filteredAndSortedCountries.map((country) => (
              <div
                key={country.countryCode}
                className={cn(
                  'p-3 rounded-lg border cursor-pointer transition-all duration-200',
                  'hover:bg-accent hover:text-accent-foreground hover:shadow-md',
                  'active:scale-95',
                  selectedCountry === country.country && 'bg-accent border-primary'
                )}
                onClick={() => onCountrySelect(country.country)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{country.country}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Active: {formatLargeNumber(country.active)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-red-600">
                      {formatLargeNumber(country.confirmed)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatLargeNumber(country.deaths)} deaths
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Count */}
        <div className="text-xs text-muted-foreground text-center pt-2 border-t">
          Showing {filteredAndSortedCountries.length} of {countries.length} countries
        </div>
      </CardContent>
    </Card>
  );
} 