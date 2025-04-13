import { useCallback } from 'react';

export function useScrollToSection() {
  const scrollToSection = useCallback((ref, closeMobileMenu = () => {}) => {
    if (!ref || !ref.current) return;

    // Добавляем отступ для фиксированного хедера
    const headerHeight = 80; // Примерная высота фиксированного хедера
    const elementPosition = ref.current.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });

    // Закрываем мобильное меню при навигации
    closeMobileMenu();
  }, []);

  return scrollToSection;
}
