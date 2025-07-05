import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Plus, Users, AlertCircle, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { formatLargeNumber } from '@/lib/utils';
import type { CountrySummary } from '@/types/covid';

interface CountryComparisonProps {
  countries: CountrySummary[];
  selectedCountries: string[];
  onCountryAdd: (country: string) => void;
  onCountryRemove: (country: string) => void;
  onClose: () => void;
}

function ComparisonCard({ country, onRemove }: {
  country: CountrySummary;
  onRemove: () => void;
}) {
  const deathRate = country.confirmed > 0 ? (country.deaths / country.confirmed) * 100 : 0;
  const recoveryRate = country.confirmed > 0 ? (country.recovered / country.confirmed) * 100 : 0;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{country.country}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-blue-600">Total Cases</div>
            <div className="text-lg font-bold">{formatLargeNumber(country.confirmed)}</div>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-red-600">Deaths</div>
            <div className="text-lg font-bold">{formatLargeNumber(country.deaths)}</div>
            <div className="text-xs text-red-500">{deathRate.toFixed(1)}%</div>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
            <TrendingUp className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-green-600">Recovered</div>
            <div className="text-lg font-bold">{formatLargeNumber(country.recovered)}</div>
            <div className="text-xs text-green-500">{recoveryRate.toFixed(1)}%</div>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <Activity className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <div className="text-sm font-medium text-orange-600">Active</div>
            <div className="text-lg font-bold">{formatLargeNumber(country.active)}</div>
          </div>
        </div>

        {/* Mini Charts */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Recovery Rate</span>
            <span className="font-medium">{recoveryRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${recoveryRate}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Death Rate</span>
            <span className="font-medium">{deathRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(deathRate, 100)}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CountrySelector({ countries, selectedCountries, onCountryAdd }: {
  countries: CountrySummary[];
  selectedCountries: string[];
  onCountryAdd: (country: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const availableCountries = countries.filter(country =>
    !selectedCountries.includes(country.country) &&
    country.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add Country
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="max-h-40 overflow-y-auto space-y-1">
            {availableCountries.slice(0, 10).map((country) => (
              <button
                key={country.country}
                onClick={() => onCountryAdd(country.country)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{country.country}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatLargeNumber(country.confirmed)} cases
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonChart({ countries }: { countries: CountrySummary[] }) {
  const maxCases = Math.max(...countries.map(c => c.confirmed));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Visual Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Cases Comparison */}
          <div>
            <h4 className="text-sm font-medium mb-3">Total Cases</h4>
            <div className="space-y-2">
              {countries.map((country) => (
                <div key={country.country} className="flex items-center gap-3">
                  <div className="w-20 text-sm font-medium truncate">{country.country}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${(country.confirmed / maxCases) * 100}%` }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground w-16 text-right">
                    {formatLargeNumber(country.confirmed)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Deaths Comparison */}
          <div>
            <h4 className="text-sm font-medium mb-3">Deaths</h4>
            <div className="space-y-2">
              {countries.map((country) => {
                const maxDeaths = Math.max(...countries.map(c => c.deaths));
                return (
                  <div key={country.country} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-medium truncate">{country.country}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-red-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(country.deaths / maxDeaths) * 100}%` }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground w-16 text-right">
                      {formatLargeNumber(country.deaths)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recovery Rate Comparison */}
          <div>
            <h4 className="text-sm font-medium mb-3">Recovery Rate</h4>
            <div className="space-y-2">
              {countries.map((country) => {
                const recoveryRate = country.confirmed > 0 ? (country.recovered / country.confirmed) * 100 : 0;
                return (
                  <div key={country.country} className="flex items-center gap-3">
                    <div className="w-20 text-sm font-medium truncate">{country.country}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${recoveryRate}%` }}
                      />
                    </div>
                    <div className="text-sm text-muted-foreground w-16 text-right">
                      {recoveryRate.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CountryComparison({
  countries,
  selectedCountries,
  onCountryAdd,
  onCountryRemove,
  onClose
}: CountryComparisonProps) {
  const selectedCountryData = countries.filter(c => selectedCountries.includes(c.country));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-background rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Country Comparison</h2>
            <p className="text-sm text-muted-foreground">
              Compare COVID-19 statistics across countries
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {selectedCountryData.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No countries selected</h3>
              <p className="text-muted-foreground">
                Add countries below to start comparing their COVID-19 statistics
              </p>
            </div>
          ) : (
            <>
              {/* Selected Countries Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCountryData.map((country) => (
                  <ComparisonCard
                    key={country.country}
                    country={country}
                    onRemove={() => onCountryRemove(country.country)}
                  />
                ))}
              </div>

              {/* Visual Comparison */}
              {selectedCountryData.length > 1 && (
                <ComparisonChart countries={selectedCountryData} />
              )}
            </>
          )}

          {/* Add Country Section */}
          {selectedCountries.length < 3 && (
            <CountrySelector
              countries={countries}
              selectedCountries={selectedCountries}
              onCountryAdd={onCountryAdd}
            />
          )}

          {selectedCountries.length >= 3 && (
            <div className="text-center py-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Maximum of 3 countries can be compared at once
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 