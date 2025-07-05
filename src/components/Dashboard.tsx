import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Menu, X, Users, TrendingUp, Activity, AlertCircle, Moon, Sun } from 'lucide-react';
import { covidApi } from '@/services/covidApi';

import { useTheme } from '@/hooks/useTheme';
import { toast } from '@/hooks/use-toast';
import { formatLargeNumber } from '@/lib/utils';
import { CovidMap } from '@/components/CovidMap';
import { TrendsSection } from '@/components/TrendsSection';
import { RecentUpdates } from '@/components/RecentUpdates';
import { RegionalFilter } from '@/components/RegionalFilter';
import { countryToRegion } from '@/utils/regionMapping';
import { SortingControls } from '@/components/SortingControls';
import { sortCountries, type SortField, type SortDirection } from '@/utils/sortingUtils';
import { CountryDetailModal } from '@/components/CountryDetailModal';
import { CountryComparison } from '@/components/CountryComparison';
import { SkeletonCard, SkeletonCountryList, SkeletonMap, SkeletonTrendsSection } from '@/components/SkeletonLoader';
import { useFavorites } from '@/hooks/useFavorites';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  className?: string;
}

function StatsCard({ title, value, icon, description, className }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

import type { CountrySummary } from '@/types/covid';

interface CountryListProps {
  countries: CountrySummary[];
  selectedCountry?: string;
  onCountrySelect: (country: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCountryDetail?: (country: string) => void;
  onComparisonAdd?: (country: string) => void;
  comparisonCountries?: string[];
  favorites?: string[];
  onToggleFavorite?: (country: string) => void;
  isFavorite?: (country: string) => boolean;
}

function CountryList({ 
  countries, 
  selectedCountry, 
  onCountrySelect, 
  searchQuery, 
  onSearchChange,
  onCountryDetail,
  onComparisonAdd,
  comparisonCountries = [],
  onToggleFavorite,
  isFavorite
}: CountryListProps) {
  const filteredCountries = countries.filter(country =>
    country.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Countries</CardTitle>
        <CardDescription>
          COVID-19 statistics by country
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredCountries.map((country) => (
              <div
                key={country.country}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedCountry === country.country
                    ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                                    onClick={() => onCountrySelect(country.country)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{country.country}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatLargeNumber(country.confirmed)} cases
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        <p className="text-red-600">
                          {formatLargeNumber(country.deaths)} deaths
                        </p>
                        <p className="text-green-600">
                          {formatLargeNumber(country.recovered)} recovered
                        </p>
                      </div>
                    </div>
                    {(onCountryDetail || onComparisonAdd) && (
                      <div className="flex gap-2 mt-2">
                        {onCountryDetail && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCountryDetail(country.country);
                            }}
                            className="flex-1"
                          >
                            Details
                          </Button>
                        )}
                        {onComparisonAdd && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onComparisonAdd(country.country);
                            }}
                            disabled={comparisonCountries.includes(country.country) || comparisonCountries.length >= 3}
                            className="flex-1"
                          >
                            Compare
                          </Button>
                        )}
                        {onToggleFavorite && isFavorite && (
                          <Button
                            size="sm"
                            variant={isFavorite(country.country) ? "default" : "outline"}
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(country.country);
                            }}
                            className="px-2"
                          >
                            ⭐
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortField, setSortField] = useState<SortField>('confirmed');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonCountries, setComparisonCountries] = useState<string[]>([]);
  const { theme, setTheme } = useTheme();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Query global data
  const { data: globalData, isLoading: globalLoading, error: globalError } = useQuery({
    queryKey: ['global-summary'],
    queryFn: async () => {
      const response = await covidApi.getGlobalSummary();
      if (!response.success && response.message) {
        toast({
          title: "Data Notice",
          description: response.message,
          variant: "default",
        });
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });

  // Query countries data
  const { data: countriesData, isLoading: countriesLoading, error: countriesError } = useQuery({
    queryKey: ['countries-data'],
    queryFn: async () => {
      const response = await covidApi.getCountriesData();
      if (!response.success && response.message) {
        toast({
          title: "Data Notice",
          description: response.message,
          variant: "default",
        });
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    refetchInterval: 15 * 60 * 1000,
  });

  // Filter and sort countries
  const filteredCountries = React.useMemo(() => {
    if (!countriesData) return [];
    
    const filtered = countriesData.filter(country => {
      // Text search filter
      const matchesSearch = country.country.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Region filter
      const matchesRegion = selectedRegion === 'all' || 
        countryToRegion[country.country] === selectedRegion;
      
      return matchesSearch && matchesRegion;
    });
    
    // Apply sorting
    return sortCountries(filtered, sortField, sortDirection);
  }, [countriesData, searchQuery, selectedRegion, sortField, sortDirection]);

  const handleCountrySelect = (country: string) => {
    setSelectedCountry(country);
    setIsMobileMenuOpen(false);
  };

  const handleCountryDetail = (country: string) => {
    setSelectedCountry(country);
    setShowDetailModal(true);
  };

  const handleSortChange = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  const handleComparisonAdd = (country: string) => {
    if (comparisonCountries.length < 3 && !comparisonCountries.includes(country)) {
      setComparisonCountries([...comparisonCountries, country]);
    }
  };

  const handleComparisonRemove = (country: string) => {
    setComparisonCountries(comparisonCountries.filter(c => c !== country));
  };

  const isLoading = globalLoading || countriesLoading;
  const hasError = globalError || countriesError;

  if (hasError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load COVID-19 data. Please check your internet connection and try again.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">COVID-19 Tracker</h1>
          </div>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden md:flex items-center gap-2">
              <Sun className="h-4 w-4" />
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme}
              />
              <Moon className="h-4 w-4" />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mb-6">
            <div className="bg-background border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Sun className="h-4 w-4" />
                <Switch 
                  checked={theme === 'dark'} 
                  onCheckedChange={toggleTheme}
                />
                <Moon className="h-4 w-4" />
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowComparison(true)}
                  className="w-full"
                  variant="outline"
                >
                  Compare Countries
                </Button>
                
                {filteredCountries && (
                  <CountryList
                    countries={filteredCountries.slice(0, 5)}
                    selectedCountry={selectedCountry}
                    onCountrySelect={handleCountrySelect}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onCountryDetail={handleCountryDetail}
                    onComparisonAdd={handleComparisonAdd}
                    comparisonCountries={comparisonCountries}
                    favorites={favorites}
                    onToggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Global Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : (
                <>
                  <StatsCard
                    title="Total Cases"
                    value={formatLargeNumber(globalData?.totalConfirmed || 0)}
                    icon={<Users className="h-4 w-4" />}
                    description="Confirmed cases worldwide"
                  />
                  <StatsCard
                    title="Total Deaths"
                    value={formatLargeNumber(globalData?.totalDeaths || 0)}
                    icon={<AlertCircle className="h-4 w-4" />}
                    description="Deaths worldwide"
                  />
                  <StatsCard
                    title="Total Recovered"
                    value={formatLargeNumber(globalData?.totalRecovered || 0)}
                    icon={<TrendingUp className="h-4 w-4" />}
                    description="Recovered cases"
                  />
                  <StatsCard
                    title="Active Cases"
                    value={formatLargeNumber(
                      (globalData?.totalConfirmed || 0) - (globalData?.totalDeaths || 0) - (globalData?.totalRecovered || 0)
                    )}
                    icon={<Activity className="h-4 w-4" />}
                    description="Currently active cases"
                  />
                </>
              )}
            </div>

            {/* Filters Section */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="h-4 w-4 text-blue-600" />
                  Filters & Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <RegionalFilter
                    selectedRegion={selectedRegion}
                    onRegionChange={setSelectedRegion}
                  />
                  <SortingControls
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSortChange={handleSortChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Global Map */}
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Activity className="h-6 w-6 text-blue-600" />
                Global Map
              </h2>
              <p className="text-muted-foreground mb-4">
                Interactive map showing COVID-19 data by country
              </p>
              {isLoading ? (
                <SkeletonMap />
              ) : filteredCountries ? (
                <CovidMap
                  countries={filteredCountries}
                  selectedCountry={selectedCountry}
                  onCountrySelect={handleCountrySelect}
                  className="w-full"
                />
              ) : null}
            </div>

            {/* Trends Section */}
            {isLoading ? (
              <SkeletonTrendsSection />
            ) : (
              <TrendsSection globalData={globalData} />
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block space-y-6">
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowComparison(true)}
                className="flex-1"
                variant="outline"
              >
                Compare Countries
              </Button>
            </div>
            
            {isLoading ? (
              <SkeletonCountryList />
            ) : filteredCountries ? (
              <CountryList
                countries={filteredCountries}
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onCountryDetail={handleCountryDetail}
                onComparisonAdd={handleComparisonAdd}
                comparisonCountries={comparisonCountries}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            ) : null}
            
            <RecentUpdates />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailModal && selectedCountry && (
        <CountryDetailModal
          country={filteredCountries?.find(c => c.country === selectedCountry) || null}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {showComparison && (
        <CountryComparison
          countries={countriesData || []}
          selectedCountries={comparisonCountries}
          onCountryAdd={handleComparisonAdd}
          onCountryRemove={handleComparisonRemove}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                COVID-19 Tracker
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time tracking of COVID-19 statistics worldwide. 
                Stay informed with the latest data and trends.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Sources</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>World Health Organization (WHO)</li>
                <li>Centers for Disease Control (CDC)</li>
                <li>API Ninjas COVID-19 API</li>
                <li>Global Health Database</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Last Updated</h3>
              <p className="text-sm text-muted-foreground">
                {globalData?.lastUpdated ? 
                  new Date(globalData.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 
                  'Loading...'
                }
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Data refreshes every 10 minutes
              </p>
            </div>
          </div>
          <div className="border-t pt-4 mt-4 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 COVID-19 Tracker. Built with React, TypeScript, and Tailwind CSS.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 