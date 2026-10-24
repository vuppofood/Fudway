import React, { createContext, useContext, useMemo, useState } from 'react';

type FavoritesContextValue = {
  favoriteNames: string[];
  isFavorite: (name: string) => boolean;
  toggleFavorite: (name: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteNames, setFavoriteNames] = useState<string[]>([]);

  const value = useMemo(
    () => ({
      favoriteNames,
      isFavorite: (name: string) => favoriteNames.includes(name),
      toggleFavorite: (name: string) => {
        setFavoriteNames((current) =>
          current.includes(name)
            ? current.filter((favorite) => favorite !== name)
            : [...current, name],
        );
      },
    }),
    [favoriteNames],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites precisa ser usado dentro de FavoritesProvider.');
  }
  return context;
}
