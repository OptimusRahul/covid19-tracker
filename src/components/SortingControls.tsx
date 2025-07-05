import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, TrendingUp, TrendingDown, Users, AlertCircle, Activity } from 'lucide-react';
import { type SortField, type SortDirection } from '@/utils/sortingUtils';



interface SortingControlsProps {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
}

const sortOptions = [
  {
    id: 'country' as SortField,
    name: 'Country Name',
    icon: ArrowUpDown,
    description: 'Alphabetical order'
  },
  {
    id: 'confirmed' as SortField,
    name: 'Total Cases',
    icon: Users,
    description: 'Total confirmed cases'
  },
  {
    id: 'deaths' as SortField,
    name: 'Total Deaths',
    icon: AlertCircle,
    description: 'Total deaths'
  },
  {
    id: 'recovered' as SortField,
    name: 'Total Recovered',
    icon: TrendingUp,
    description: 'Total recovered cases'
  },
  {
    id: 'active' as SortField,
    name: 'Active Cases',
    icon: Activity,
    description: 'Currently active cases'
  },
  {
    id: 'deathRate' as SortField,
    name: 'Death Rate',
    icon: TrendingDown,
    description: 'Death rate percentage'
  },
  {
    id: 'recoveryRate' as SortField,
    name: 'Recovery Rate',
    icon: TrendingUp,
    description: 'Recovery rate percentage'
  },
];

export function SortingControls({ sortField, sortDirection, onSortChange }: SortingControlsProps) {
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to desc for numeric fields, asc for text
      onSortChange(field, field === 'country' ? 'asc' : 'desc');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <ArrowUpDown className="h-3 w-3" />
          Sort Countries
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="space-y-1">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isActive = sortField === option.id;

            return (
              <Button
                key={option.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSort(option.id)}
                className="w-full flex items-center justify-between group h-9 px-3"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3 w-3" />
                  <div className="text-left">
                    <div className="font-medium text-xs">{option.name}</div>
                    <div className="text-[10px] text-muted-foreground group-hover:text-foreground leading-tight">
                      {option.description}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center gap-1">
                    {sortDirection === 'asc' ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    <span className="text-[10px]">
                      {sortDirection === 'asc' ? 'Low→High' : 'High→Low'}
                    </span>
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
} 