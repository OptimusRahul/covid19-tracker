import { useEffect } from 'react';
import { useCovidStore } from '@/store/covidStore';
import { useGlobalSummary, useCountriesData } from '@/hooks/useCovidData';
import { Dashboard } from '@/components/Dashboard';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const { isDarkMode, setError } = useCovidStore();

  // Fetch global data on app start
  const { error: globalError } = useGlobalSummary();
  const { error: countriesError } = useCountriesData();

  // Handle API errors
  useEffect(() => {
    if (globalError || countriesError) {
      const errorMessage = globalError?.message || countriesError?.message || 'Failed to fetch COVID-19 data';
      setError(errorMessage);
    }
  }, [globalError, countriesError, setError]);

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme={isDarkMode ? 'dark' : 'light'} storageKey="covid-tracker-theme">
        <div className={cn(
          "min-h-screen bg-background text-foreground",
          "transition-colors duration-300",
          "antialiased"
        )}>
          <Dashboard />
          <Toaster />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App; 