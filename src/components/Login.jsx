import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth.jsx";
import styles from "./Login.module.css";
import domainUrl from "../utils/domain.js";

function Login({ setUser, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isNavigationLoading, setIsNavigationLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { authState, setAuthState } = useAuth();
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${domainUrl}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Add your API key to the headers
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const error= await response.json()
        throw error
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken)
      setAuthState({ isAuthenticated: true, loading: false, user:data.user });
      // Redirect after storing the token
      console.log(data)
      console.log(authState)
    } catch (error) {
      setError("Login failed. Please try again.");
      console.log("Error fetching from post API:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isNavigationLoading ? (
        <div>Navigation loading...</div>
      ) : (
        <div className={styles.loginFormContainer}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              className={styles.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className={styles.password}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              disabled={isLoading}
              className={styles.loginButton}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      )}
    </>
  );
}

export default Login;
