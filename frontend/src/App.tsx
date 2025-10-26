import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import TaskHistoryPage from './pages/TaskHistory/TaskHistory';
import Email from './pages/Email/Email';
import Login from './pages/Login/Login';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent = () => {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-neutral-lightest to-white">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-law-navy mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-neutral-dark">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public route - Login page */}
      <Route
        path="/login"
        element={
          isAuthenticated ?
            <Navigate to="/" replace /> :
            <Login />
        }
      />
      
      {/* Protected routes - Main application */}
      <Route
        path="/*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-neutral-lightest to-white">
              <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
              <Header
                isAuthenticated={isAuthenticated}
                onLogout={logout}
              />
              <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/history" element={<TaskHistoryPage />} />
                  <Route path="/email" element={<Email />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;