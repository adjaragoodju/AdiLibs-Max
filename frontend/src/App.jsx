// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context providers
import { AuthProvider } from './contexts/AuthContext';

// Layout components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import BooksPage from './pages/BooksPage';
import BookDetailPage from './pages/BookDetailPage';
import AuthorsPage from './pages/AuthorsPage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import MyBooksPage from './pages/MyBooksPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FavoritesPage from './pages/FavoritesPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected route
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <main className='flex-grow container mx-auto px-4 py-8'>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/books' element={<BooksPage />} />
              <Route path='/books/:id' element={<BookDetailPage />} />
              <Route path='/authors' element={<AuthorsPage />} />
              <Route path='/authors/:id' element={<AuthorDetailPage />} />
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/my-books' element={<MyBooksPage />} />
                <Route path='/favorites' element={<FavoritesPage />} />
              </Route>

              {/* 404 Not Found */}
              <Route path='*' element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position='bottom-right' />
      </Router>
    </AuthProvider>
  );
}

export default App;
