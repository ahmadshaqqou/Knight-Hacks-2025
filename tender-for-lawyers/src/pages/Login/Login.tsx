import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any login
      setIsLoading(false);
      
      // Call the onLogin callback if provided
      if (onLogin) {
        onLogin();
      }
      
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-neutral-lightest to-white px-4">
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-law-navy mb-2">Tender for Lawyers</h1>
          <p className="text-neutral-dark">Sign in to your account</p>
        </div>
        
        <div className="bg-white rounded-md shadow-sm border border-neutral-light p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-law-navy focus:border-transparent"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-dark">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-law-blue hover:text-law-navy">
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-2 border border-neutral-light rounded-md focus:outline-none focus:ring-2 focus:ring-law-navy focus:border-transparent"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-law-navy focus:ring-law-blue border-neutral-light rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-dark">
                  Remember me
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
                isLoading ? 'bg-neutral-light cursor-not-allowed' : 'bg-law-navy hover:bg-law-blue'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-dark">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-law-blue hover:text-law-navy">
                Create one
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-neutral">
          <p>© {new Date().getFullYear()} Tender for Lawyers. All rights reserved.</p>
          <p className="mt-1">
            <Link to="/privacy" className="hover:text-law-blue">Privacy Policy</Link>
            {' · '}
            <Link to="/terms" className="hover:text-law-blue">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;