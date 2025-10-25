import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import TaskHistoryPage from './pages/TaskHistory/TaskHistory';
import Login from './pages/Login/Login';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // For demo purposes, we'll authenticate the user when they log in
  // In a real app, this would be handled by a proper auth system with tokens
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Routes>
      {/* Public route - Login page */}
      <Route
        path="/login"
        element={
          isAuthenticated ?
            <Navigate to="/" replace /> :
            <Login onLogin={handleLogin} />
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
                onLogout={handleLogout}
              />
              <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/history" element={<TaskHistoryPage />} />
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
}

export default App;