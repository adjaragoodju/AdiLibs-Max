// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookCatalog from './pages/BookCatalog';
import BookDetail from './pages/BookDetail';
import AuthorDetail from './pages/AuthorDetail';
import AuthorsList from './pages/AuthorsList';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/auth/PrivateRoute';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className='flex flex-col min-h-screen'>
          <Header />
          <main className='flex-grow'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/register' element={<Register />} />
              <Route path='/books' element={<BookCatalog />} />
              <Route path='/books/:id' element={<BookDetail />} />
              <Route path='/authors' element={<AuthorsList />} />
              <Route path='/authors/:id' element={<AuthorDetail />} />

              {/* Protected Routes */}
              <Route
                path='/profile'
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path='/my-books'
                element={
                  <PrivateRoute>
                    <Navigate to='/profile' replace />
                  </PrivateRoute>
                }
              />

              {/* 404 Page */}
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;
