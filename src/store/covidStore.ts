import { create } from 'zustand';
import { devtools } from 'zustand/middleware';


interface CovidStore {
  // Theme state
  isDarkMode: boolean;
  toggleTheme: () => void;
  
  // Selected country state
  selectedCountry: string | null;
  setSelectedCountry: (country: string | null) => void;
  
  // Map state
  mapCenter: [number, number];
  mapZoom: number;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  
  // UI state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Error state
  error: string | null;
  setError: (error: string | null) => void;
  
  // Global/Country view mode
  isGlobalView: boolean;
  setGlobalView: (isGlobal: boolean) => void;
  
  // Mobile drawer state
  isMobileDrawerOpen: boolean;
  setMobileDrawerOpen: (open: boolean) => void;
}

export const useCovidStore = create<CovidStore>()(
  devtools(
    (set) => ({
      // Theme state
      isDarkMode: true,
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Selected country state
      selectedCountry: null,
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      
      // Map state
      mapCenter: [20, 0], // Default to center of world
      mapZoom: 2,
      setMapCenter: (center) => set({ mapCenter: center }),
      setMapZoom: (zoom) => set({ mapZoom: zoom }),
      
      // UI state
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      
      // Error state
      error: null,
      setError: (error) => set({ error }),
      
      // Global/Country view mode
      isGlobalView: true,
      setGlobalView: (isGlobal) => set({ isGlobalView: isGlobal }),
      
      // Mobile drawer state
      isMobileDrawerOpen: false,
      setMobileDrawerOpen: (open) => set({ isMobileDrawerOpen: open }),
    }),
    {
      name: 'covid-store',
    }
  )
); 