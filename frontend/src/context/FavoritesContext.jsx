import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Загрузка избранного из localStorage при инициализации
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('adilibs-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    }
  }, []);

  // Добавление книги в избранное
  const addToFavorites = (book) => {
    if (!favorites.some((fav) => fav.title === book.title)) {
      const newFavorites = [...favorites, book];
      setFavorites(newFavorites);

      // Сохранение в localStorage
      try {
        localStorage.setItem('adilibs-favorites', JSON.stringify(newFavorites));
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error);
      }
    }
  };

  // Удаление книги из избранного
  const removeFromFavorites = (bookToRemove) => {
    const newFavorites = favorites.filter(
      (book) => book.title !== bookToRemove.title
    );
    setFavorites(newFavorites);

    // Обновление localStorage
    try {
      localStorage.setItem('adilibs-favorites', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to update favorites in localStorage:', error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addToFavorites, removeFromFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Хук для использования контекста
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
