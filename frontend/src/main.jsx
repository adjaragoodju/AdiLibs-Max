// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Root from './pages/Root';
import { FavoritesProvider } from './context/FavoritesContext';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FavoritesProvider>
      <Root />
    </FavoritesProvider>
  </StrictMode>
);
