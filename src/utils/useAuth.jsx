import{ createContext, useState, useEffect, useContext } from 'react';
import {jwtDecode } from 'jwt-decode';

// Create context
const AuthContext = createContext();

// A function to check if the token is nearing expiration
const isTokenNearingExpiry = (exp, buffer = 300) => { // Buffer in seconds (default: 5 minutes)
  return Date.now() >= (exp - buffer) * 1000; // Convert to milliseconds
};

// AuthProvider component that provides authentication state
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
  });

  // Get the JWT and refresh token from cookies or local storage
  const getToken = () => {
    return {
      accessToken: localStorage.getItem('accessToken'),
      refreshToken: localStorage.getItem('refreshToken'),
    };
  };

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    const { refreshToken } = getToken();
    if (!refreshToken) return;

    try {
      const response = await fetch('/api/user/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error('Failed to refresh token');
      
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      setAuthState({ isAuthenticated: true, loading: false });
    } catch (error) {
      console.error('Token refresh failed:', error);
      setAuthState({ isAuthenticated: false, loading: false });
    }
  };

  // Check token validity and refresh if nearing expiration
  useEffect(() => {
    const { accessToken } = getToken();

    if (accessToken) {
      const decoded = jwtDecode(accessToken);

      if (isTokenNearingExpiry(decoded.exp)) {
        refreshAccessToken();
      } else {
        setAuthState({ isAuthenticated: true, loading: false });

        // Set up a timer to refresh the token automatically before expiration
        const timeToExpiry = (decoded.exp * 1000) - Date.now() - 300000; // 5 minutes before expiry
        const refreshTimer = setTimeout(() => {
          refreshAccessToken();
        }, timeToExpiry);

        return () => clearTimeout(refreshTimer); // Clear the timer on component unmount
      }
    } else {
      setAuthState({ isAuthenticated: false, loading: false });
    }
  }, []); // Runs once when component mounts

  return (
    <AuthContext.Provider value={{ authState, refreshAccessToken, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};