import { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from "react-router-dom";
import domainUrl from "./domain";

// Create context
const AuthContext = createContext();

// A function to check if the token is nearing expiration
const isTokenNearingExpiry = (exp, buffer = 300) => {
  // Buffer in seconds (default: 5 minutes)
  return Date.now() >= (exp - buffer) * 1000; // Convert to milliseconds
};

// AuthProvider component that provides authentication state
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    loading: true,
    user: null,
  });
  const navigate = useNavigate(); // React Router hook for navigation
  const location = useLocation(); // React Router hook to get the current location

  // Get the JWT and refresh token from cookies or local storage
  const getToken = () => {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  };

  // Function to refresh the access token
  const refreshAccessToken = async () => {
    const { refreshToken } = getToken();

    if (!refreshToken) return;

    try {
      const response = await fetch(
        `${domainUrl}/api/users/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        console.log(error);
        throw error;
      }

      const data = await response.json();

      localStorage.setItem("accessToken", data.accessToken);
      setAuthState({ isAuthenticated: true, loading: false, user: data.user });
    } catch (error) {
      console.log(error);
      setAuthState({ isAuthenticated: false, loading: false });
    }
  };

  // Check token validity and refresh if nearing expiration
  useEffect(() => {
    console.log("Initiate refresh effect");
    const { accessToken } = getToken();

    if (accessToken) {
      const decoded = jwtDecode(accessToken);
  

      if (isTokenNearingExpiry(decoded.exp)) {
        console.log("Access token near expiry intiate refresh 1");
        refreshAccessToken();
      } else {
        if (!authState.isAuthenticated) {
          //   REUSED REFRESHTOKENFUNCTION FOR SIMPLICITY. CONSIDER ADDING AUTH FETCHING BASED ON ACCESS TOKEN INSTEAD.
          console.log(
            "Existing Token but not authenticated, initate refreshToken 2 "
          );
          refreshAccessToken();
        }
        console.log(authState);
        // Set up a timer to refresh the token automatically before expiration
        const timeToExpiry = decoded.exp * 1000 - Date.now() - 300000; // 5 minutes before expiry
        const refreshTimer = setTimeout(() => {
          refreshAccessToken();
        }, timeToExpiry);

        return () => clearTimeout(refreshTimer); // Clear the timer on component unmount
      }
    } else {
      setAuthState({ isAuthenticated: false, loading: false });
    }
  }, []);

  // TEST MOVING NAVIGATION LOGIC TO RENDERED COMPONENT USING <NAVIGATE/>
  // CHECK IF POSSIBLE TO ADD LOGIC SO THAT IF A USER HAS NO AUTH AT PAGE THE USER IS PROMPTED TO LOG IN AND (!IMPORTANT) SENT TO THE PAGE THE USER TRIED TO ACCESS
  useEffect(() => {
    console.log("should navigate")
    if(!authState.isAuthenticated && !authState.loading) {
      if (location.pathname !== "/signup") {
        console.log("navigating to login");
        navigate("/login");
      }
    }
  }, [authState]);
  // Runs once when component mounts

  return (
    <AuthContext.Provider
      value={{ authState, setAuthState, refreshAccessToken, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
