import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, MapPin, Users, TrendingUp, AlertCircle, Activity, Globe } from 'lucide-react';
import { formatLargeNumber } from '@/lib/utils';
import type { CountrySummary } from '@/types/covid';

interface CountryDetailModalProps {
  country: CountrySummary | null;
  onClose: () => void;
}

function StatCard({ title, value, icon, color, percentage }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  percentage?: number;
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {percentage !== undefined && (
          <div className="text-sm text-muted-foreground">
            {percentage.toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold">{formatLargeNumber(value)}</div>
      <div className="text-sm text-muted-foreground">{title}</div>
    </div>
  );
}

function ProgressBar({ value, total, color, label }: {
  value: number;
  total: number;
  color: string;
  label: string;
}) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${color}`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <div className="text-xs text-muted-foreground">
        {formatLargeNumber(value)} of {formatLargeNumber(total)}
      </div>
    </div>
  );
}

export function CountryDetailModal({ country, onClose }: CountryDetailModalProps) {
  if (!country) return null;

  const deathRate = country.confirmed > 0 ? (country.deaths / country.confirmed) * 100 : 0;
  const recoveryRate = country.confirmed > 0 ? (country.recovered / country.confirmed) * 100 : 0;
  const activeRate = country.confirmed > 0 ? (country.active / country.confirmed) * 100 : 0;

  // Mock additional data - in real app, this would come from APIs
  const additionalData = {
    population: Math.floor(Math.random() * 1000000000) + 10000000,
    testsPerMillion: Math.floor(Math.random() * 100000) + 10000,
    vaccinatedPercentage: Math.floor(Math.random() * 100) + 1,
    hospitalizations: Math.floor(Math.random() * 50000) + 1000,
    criticalCases: Math.floor(Math.random() * 5000) + 100,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{country.country}</h2>
              <p className="text-sm text-muted-foreground">
                Last updated: {new Date(country.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Main Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Total Cases"
              value={country.confirmed}
              icon={<Users className="h-4 w-4 text-blue-600" />}
              color="bg-blue-100 dark:bg-blue-900"
            />
            <StatCard
              title="Deaths"
              value={country.deaths}
              icon={<AlertCircle className="h-4 w-4 text-red-600" />}
              color="bg-red-100 dark:bg-red-900"
              percentage={deathRate}
            />
            <StatCard
              title="Recovered"
              value={country.recovered}
              icon={<TrendingUp className="h-4 w-4 text-green-600" />}
              color="bg-green-100 dark:bg-green-900"
              percentage={recoveryRate}
            />
            <StatCard
              title="Active Cases"
              value={country.active}
              icon={<Activity className="h-4 w-4 text-orange-600" />}
              color="bg-orange-100 dark:bg-orange-900"
              percentage={activeRate}
            />
          </div>

          {/* Progress Bars */}
          <Card>
            <CardHeader>
              <CardTitle>Case Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar
                value={country.recovered}
                total={country.confirmed}
                color="bg-green-500"
                label="Recovery Rate"
              />
              <ProgressBar
                value={country.deaths}
                total={country.confirmed}
                color="bg-red-500"
                label="Death Rate"
              />
              <ProgressBar
                value={country.active}
                total={country.confirmed}
                color="bg-orange-500"
                label="Active Cases"
              />
            </CardContent>
          </Card>

          {/* Additional Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Population & Testing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Population</span>
                  <span className="font-medium">{formatLargeNumber(additionalData.population)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Cases per 100k</span>
                  <span className="font-medium">
                    {((country.confirmed / additionalData.population) * 100000).toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tests per Million</span>
                  <span className="font-medium">{formatLargeNumber(additionalData.testsPerMillion)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Vaccinated</span>
                  <span className="font-medium">{additionalData.vaccinatedPercentage}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Healthcare Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hospitalizations</span>
                  <span className="font-medium">{formatLargeNumber(additionalData.hospitalizations)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Critical Cases</span>
                  <span className="font-medium">{formatLargeNumber(additionalData.criticalCases)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">ICU Occupancy</span>
                  <span className="font-medium">
                    {((additionalData.criticalCases / additionalData.hospitalizations) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Hospital Rate</span>
                  <span className="font-medium">
                    {((additionalData.hospitalizations / country.active) * 100).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trends Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                7-Day Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-end justify-center space-x-2">
                {Array.from({ length: 7 }, (_, i) => (
                  <div
                    key={i}
                    className="bg-blue-500 rounded-t-sm flex-1 transition-all duration-300"
                    style={{ 
                      height: `${Math.random() * 100}%`,
                      maxWidth: '40px'
                    }}
                  />
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>7 days ago</span>
                <span>Today</span>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => {
              const countryData = {
                country: country.country,
                statistics: {
                  totalCases: country.confirmed,
                  deaths: country.deaths,
                  recovered: country.recovered,
                  active: country.active,
                  deathRate: deathRate,
                  recoveryRate: recoveryRate,
                  lastUpdated: country.lastUpdated
                },
                additionalData: additionalData
              };
              
              // Export as JSON
              const jsonContent = JSON.stringify(countryData, null, 2);
              const blob = new Blob([jsonContent], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${country.country.toLowerCase().replace(/\s+/g, '-')}-covid-data.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              window.URL.revokeObjectURL(url);
            }}>
              Export Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 