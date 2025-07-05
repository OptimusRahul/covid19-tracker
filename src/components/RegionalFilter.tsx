import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, MapPin } from 'lucide-react';

interface RegionalFilterProps {
  selectedRegion: string;
  onRegionChange: (region: string) => void;
}

const regions = [
  { id: 'all', name: 'All Regions', icon: Globe },
  { id: 'asia', name: 'Asia', icon: MapPin },
  { id: 'europe', name: 'Europe', icon: MapPin },
  { id: 'north-america', name: 'North America', icon: MapPin },
  { id: 'south-america', name: 'South America', icon: MapPin },
  { id: 'africa', name: 'Africa', icon: MapPin },
  { id: 'oceania', name: 'Oceania', icon: MapPin },
];



export function RegionalFilter({ selectedRegion, onRegionChange }: RegionalFilterProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Globe className="h-3 w-3" />
          Filter by Region
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="grid grid-cols-2 gap-1.5">
          {regions.map((region) => {
            const Icon = region.icon;
            return (
              <Button
                key={region.id}
                variant={selectedRegion === region.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => onRegionChange(region.id)}
                className="flex items-center gap-1.5 justify-start h-8 px-3 text-xs"
              >
                <Icon className="h-3 w-3" />
                <span className="truncate">{region.name}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 