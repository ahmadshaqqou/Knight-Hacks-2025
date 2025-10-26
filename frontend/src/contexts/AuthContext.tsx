import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  handleOAuthRedirect: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
      if (token) {
        try {
          // Verify token with backend
          const response = await authAPI.verifyToken(token);
          
          if (response.data.valid) {
            // Get user info
            const userResponse = await authAPI.getCurrentUser();
            setUser(userResponse.data);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem('auth_token');
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Error verifying authentication:', error);
          localStorage.removeItem('auth_token');
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Check for token in URL on OAuth redirect
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      
      if (token) {
        await handleOAuthRedirect(token);
        // Clear the token from URL to prevent it from being visible
        navigate(location.pathname, { replace: true });
      }
    };

    handleOAuthCallback();
  }, [location, navigate]);

  const login = () => {
    authAPI.loginWithGoogle();
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleOAuthRedirect = async (token: string) => {
    try {
      // Verify token with backend
      const response = await authAPI.verifyToken(token);
      
      if (response.data.valid) {
        localStorage.setItem('auth_token', token);
        
        // Get user info
        const userResponse = await authAPI.getCurrentUser();
        setUser(userResponse.data);
        setIsAuthenticated(true);
        
        // Redirect to home page
        navigate('/');
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Error handling OAuth redirect:', error);
      navigate('/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        handleOAuthRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};