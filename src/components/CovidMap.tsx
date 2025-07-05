import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { formatLargeNumber } from '@/lib/utils';
import type { CountrySummary } from '@/types/covid';
import 'leaflet/dist/leaflet.css';

interface CovidMapProps {
  countries: CountrySummary[];
  selectedCountry?: string;
  onCountrySelect: (country: string) => void;
  className?: string;
}

// Component to handle map events
function MapEvents() {
  const map = useMap();

  useEffect(() => {
    // Set map view on mount
    map.setView([20, 0], 2);
  }, [map]);

  return null;
}

// Function to calculate marker size based on cases
function getMarkerSize(cases: number, maxCases: number): number {
  const minSize = 4;
  const maxSize = 20;
  const normalized = Math.log(cases + 1) / Math.log(maxCases + 1);
  return minSize + (maxSize - minSize) * normalized;
}

// Function to get marker color based on cases per capita or total cases
function getMarkerColor(cases: number, maxCases: number): string {
  const intensity = cases / maxCases;
  if (intensity > 0.7) return '#dc2626'; // red-600
  if (intensity > 0.4) return '#ea580c'; // orange-600
  if (intensity > 0.2) return '#d97706'; // amber-600
  return '#16a34a'; // green-600
}

export function CovidMap({
  countries,
  selectedCountry,
  onCountrySelect,
  className
}: CovidMapProps) {
  // Filter countries that have coordinates
  const countriesWithCoords = useMemo(() => {
    return countries.filter(country =>
      country.latitude !== undefined &&
      country.longitude !== undefined &&
      country.latitude !== null &&
      country.longitude !== null
    );
  }, [countries]);

  const maxCases = useMemo(() => {
    return Math.max(...countriesWithCoords.map(c => c.confirmed), 1);
  }, [countriesWithCoords]);

  // Create markers for countries
  const countryMarkers = useMemo(() => {
    return countriesWithCoords.map((country) => {
      const position: LatLngExpression = [country.latitude!, country.longitude!];
      const size = getMarkerSize(country.confirmed, maxCases);
      const color = getMarkerColor(country.confirmed, maxCases);

      return {
        country,
        position,
        size,
        color,
      };
    });
  }, [countriesWithCoords, maxCases]);

  if (countriesWithCoords.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-80">
          <div className="text-center">
            <div className="text-muted-foreground">
              Loading map data...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        <div className="h-80 w-full rounded-lg overflow-hidden relative">
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="leaflet-container"
            worldCopyJump={true}
            maxBounds={[[-90, -180], [90, 180]]}
            maxBoundsViscosity={1.0}
          >
            <MapEvents />

            {/* OpenStreetMap tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              className="dark:brightness-90 dark:contrast-125 dark:hue-rotate-180 dark:invert"
            />

            {/* Country markers */}
            {countryMarkers.map(({ country, position, size, color }) => (
              <CircleMarker
                key={country.countryCode}
                center={position}
                radius={size}
                pathOptions={{
                  color: color,
                  fillColor: color,
                  fillOpacity: 0.6,
                  weight: selectedCountry === country.country ? 3 : 1,
                  opacity: selectedCountry === country.country ? 1 : 0.8,
                }}
                eventHandlers={{
                  click: () => onCountrySelect(country.country),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-semibold text-lg mb-2">{country.country}</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Cases:</span>
                        <span className="font-medium text-red-600">
                          {formatLargeNumber(country.confirmed)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deaths:</span>
                        <span className="font-medium text-gray-700">
                          {formatLargeNumber(country.deaths)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Recovered:</span>
                        <span className="font-medium text-green-600">
                          {formatLargeNumber(country.recovered)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active:</span>
                        <span className="font-medium text-orange-600">
                          {formatLargeNumber(country.active)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200">
                      <button
                        onClick={() => onCountrySelect(country.country)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg z-[1000]">
            <h4 className="font-semibold text-sm mb-2">COVID-19 Cases</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-amber-600"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-orange-600"></div>
                <span>High</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-600"></div>
                <span>Very High</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 