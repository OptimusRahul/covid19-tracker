import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ExternalLink, AlertCircle, TrendingUp, Globe } from 'lucide-react';

interface Update {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
  type: 'news' | 'data' | 'alert';
  link?: string;
}

const mockUpdates: Update[] = [
  {
    id: '1',
    title: 'Global COVID-19 Cases Continue to Decline',
    summary: 'World Health Organization reports a 15% decrease in new cases compared to last week, marking the lowest levels since early 2020.',
    timestamp: '2 hours ago',
    source: 'WHO',
    type: 'news',
    link: '#'
  },
  {
    id: '2',
    title: 'New Vaccination Campaign Launched',
    summary: 'Multiple countries begin distribution of updated vaccines targeting latest variants, with focus on high-risk populations.',
    timestamp: '5 hours ago',
    source: 'CDC',
    type: 'news',
    link: '#'
  },
  {
    id: '3',
    title: 'Data Update: Recovery Rates Improve',
    summary: 'Latest statistics show recovery rates have improved to 95.8% globally, with significant improvements in treatment protocols.',
    timestamp: '8 hours ago',
    source: 'Global Health Database',
    type: 'data',
    link: '#'
  },
  {
    id: '4',
    title: 'Travel Restrictions Updated',
    summary: 'Several countries have relaxed travel restrictions while maintaining health monitoring protocols at major airports.',
    timestamp: '12 hours ago',
    source: 'Travel Advisory',
    type: 'alert',
    link: '#'
  },
  {
    id: '5',
    title: 'Research Breakthrough in Treatment',
    summary: 'New study shows promising results for combination therapy, potentially reducing severe cases by 40%.',
    timestamp: '1 day ago',
    source: 'Medical Journal',
    type: 'news',
    link: '#'
  }
];

function getUpdateIcon(type: Update['type']) {
  switch (type) {
    case 'news':
      return <Globe className="h-4 w-4 text-blue-600" />;
    case 'data':
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    case 'alert':
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
}

function getUpdateBorderColor(type: Update['type']) {
  switch (type) {
    case 'news':
      return 'border-l-blue-500';
    case 'data':
      return 'border-l-green-500';
    case 'alert':
      return 'border-l-orange-500';
    default:
      return 'border-l-gray-500';
  }
}

export function RecentUpdates() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockUpdates.map((update) => (
            <div
              key={update.id}
              className={`p-4 border-l-4 ${getUpdateBorderColor(update.type)} bg-gray-50 dark:bg-gray-900 rounded-r-lg`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getUpdateIcon(update.type)}
                    <h4 className="font-medium text-sm">{update.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {update.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {update.timestamp} • {update.source}
                    </span>
                    {update.link && (
                      <button className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        Read more
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 