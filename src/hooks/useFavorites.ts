import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'covid-tracker-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
        setFavorites([]);
      }
    }
  }, []);

  const addFavorite = (country: string) => {
    const newFavorites = [...favorites, country];
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const removeFavorite = (country: string) => {
    const newFavorites = favorites.filter(fav => fav !== country);
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  };

  const toggleFavorite = (country: string) => {
    if (favorites.includes(country)) {
      removeFavorite(country);
    } else {
      addFavorite(country);
    }
  };

  const isFavorite = (country: string) => favorites.includes(country);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
  };
} 