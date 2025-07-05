import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, Globe, AlertTriangle } from 'lucide-react';
import { formatLargeNumber } from '@/lib/utils';

interface TrendsSectionProps {
  globalData?: {
    totalConfirmed: number;
    totalDeaths: number;
    totalRecovered: number;
    newConfirmed: number;
    newDeaths: number;
    newRecovered: number;
    lastUpdated: string;
  };
}

function TrendCard({ title, value, change, isPositive, icon }: {
  title: string;
  value: number;
  change: number;
  isPositive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatLargeNumber(value)}</div>
        <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
          {change > 0 ? '+' : ''}{formatLargeNumber(change)} from yesterday
        </div>
      </CardContent>
    </Card>
  );
}

function SimpleChart({ data, title, color }: { data: number[]; title: string; color: string }) {
  const max = Math.max(...data);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-32 flex items-end space-x-1">
          {data.map((value, index) => (
            <div
              key={index}
              className={`${color} rounded-t-sm flex-1 transition-all duration-300`}
              style={{ height: `${(value / max) * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>7 days ago</span>
          <span>Today</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendsSection({ globalData }: TrendsSectionProps) {
  // Mock trend data - in real app, this would come from API
  const dailyCases = [45000, 42000, 38000, 41000, 39000, 36000, 34000];
  const dailyDeaths = [850, 820, 790, 810, 780, 750, 720];
  const dailyRecovered = [52000, 49000, 46000, 48000, 45000, 42000, 40000];

  if (!globalData) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          Global Trends
        </h2>
        <p className="text-muted-foreground mb-6">
          Latest trends and changes in COVID-19 statistics worldwide
        </p>
      </div>

      {/* Daily Changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TrendCard
          title="New Cases"
          value={globalData.newConfirmed}
          change={globalData.newConfirmed}
          isPositive={false}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <TrendCard
          title="New Deaths"
          value={globalData.newDeaths}
          change={globalData.newDeaths}
          isPositive={false}
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <TrendCard
          title="New Recovered"
          value={globalData.newRecovered}
          change={globalData.newRecovered}
          isPositive={true}
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SimpleChart 
          data={dailyCases} 
          title="Daily Cases (7 days)" 
          color="bg-red-500" 
        />
        <SimpleChart 
          data={dailyDeaths} 
          title="Daily Deaths (7 days)" 
          color="bg-gray-500" 
        />
        <SimpleChart 
          data={dailyRecovered} 
          title="Daily Recovered (7 days)" 
          color="bg-green-500" 
        />
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recovery Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {((globalData.totalRecovered / globalData.totalConfirmed) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              of all cases have recovered
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((globalData.totalRecovered / globalData.totalConfirmed) * 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Case Fatality Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {((globalData.totalDeaths / globalData.totalConfirmed) * 100).toFixed(1)}%
            </div>
            <p className="text-sm text-muted-foreground">
              case fatality rate worldwide
            </p>
            <div className="mt-4 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((globalData.totalDeaths / globalData.totalConfirmed) * 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 