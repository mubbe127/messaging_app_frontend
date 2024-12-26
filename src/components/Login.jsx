import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth.jsx";
import styles from "./Login.module.css";

function Login({ setUser, setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isNavigationLoading, setIsNavigationLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { authState } = useAuth();
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate("/home");
    }
    setIsNavigationLoading(false)
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:4100/api/users/login`, {
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
        throw new Error(`Server responded with status ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      // Redirect after storing the token
      navigate("/home");
    } catch (error) {
      setError("Login failed. Please try again.");
      console.error("Error fetching from post API:", error);
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
