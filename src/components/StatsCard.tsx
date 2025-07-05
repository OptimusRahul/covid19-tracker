import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, formatLargeNumber, getRelativeTime } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  lastUpdated?: string;
  isLoading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
  lastUpdated,
  isLoading = false,
  className,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <Card className={cn('fade-in', bgColor, className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('fade-in transition-all duration-300 hover:shadow-lg', bgColor, className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground/80">
          {title}
        </CardTitle>
        <Icon className={cn('h-4 w-4', color)} />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={cn('text-2xl font-bold', color)}>
            {formatLargeNumber(value)}
          </div>
          
          <div className="flex items-center justify-between">
            {trend && (
              <div className={cn(
                'flex items-center text-xs',
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              )}>
                <span className="font-medium">
                  {trend.isPositive ? '+' : ''}{formatLargeNumber(trend.value)}
                </span>
                <span className="ml-1 text-muted-foreground">today</span>
              </div>
            )}
            
            {lastUpdated && (
              <p className="text-xs text-muted-foreground">
                {getRelativeTime(lastUpdated)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsCardSkeleton() {
  return (
    <Card className="fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4 rounded" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24 mb-2" />
        <Skeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
} 