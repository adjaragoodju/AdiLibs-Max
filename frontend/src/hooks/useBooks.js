import { useMemo } from 'react';
import booksData from '../data/books.json';

export function useBooks() {
  // Кэшируем уникальные жанры и авторов
  const uniqueGenres = useMemo(
    () => [...new Set(booksData.map((book) => book.genre))],
    []
  );

  const uniqueAuthors = useMemo(
    () => [...new Set(booksData.map((book) => book.author))],
    []
  );

  // Функция для фильтрации книг
  const getBooksByFilter = (filterType, filterValue) => {
    return booksData.filter((book) => book[filterType] === filterValue);
  };

  // Функция для поиска книг
  const searchBooks = (query) => {
    if (!query.trim()) return [];

    return booksData.filter(
      (book) =>
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    books: booksData,
    uniqueGenres,
    uniqueAuthors,
    getBooksByFilter,
    searchBooks,
  };
}
