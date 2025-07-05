import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </CardContent>
    </Card>
  );
}

export function SkeletonCountryList() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-48"></div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="p-3 border rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonMap() {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="h-80 w-full bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-48 mx-auto"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonChart() {
  return (
    <Card>
      <CardHeader>
        <div className="h-5 bg-gray-200 rounded w-32"></div>
      </CardHeader>
      <CardContent>
        <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
      </CardContent>
    </Card>
  );
}

export function SkeletonTrendsSection() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
      </div>

      {/* Daily Changes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonChart key={i} />
        ))}
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </CardContent>
        </Card>
        <Card className="animate-pulse">
          <CardHeader>
            <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-40 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 