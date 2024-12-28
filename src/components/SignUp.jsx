import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

import styles from "./SignUp.module.css";


function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(false);
  const [isNavigationLoading, setIsNavigationLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const {authState, setAuthState}= useAuth()
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    fetch(`http://localhost:4100/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add this header
      },
      body: JSON.stringify({
        username,
        password,
        confirmPassword,
        firstname,
        lastname,
        email,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            const error = errorData.errors ? errorData.errors : errorData;
            // Attach the parsed JSON error

            throw error; // Throw the error with additional details
          });
        }
        return response.json();
      })
      .then((data) => {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken)
        console.log(data.message);
        console.log(data)
        setUser(data.user);
        setAuthState({isAuthenticated:true, loading: false})
      })
      .catch((err) => {
        console.log(err);
        setErrors(err);
       
      })
      .finally(() => setIsLoading(false));
  }
  return (
    <>
      {user ? (
        <div className={styles.welcomeUser}>
          <h3>Welcome {user.username}</h3>
          <p> Click the link to get to <Link to="/home">homepage</Link></p>
        </div>
      ) : (
        <div className={styles.signUpFormContainer}>
          <div className={styles.heading}>
            <h5>Sign Up</h5>
            <p>
              By continuing, you agree to our User Agreement and acknowledge
              that you understand the Privacy Policy.
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.name}>
              <input
                className={styles.firstname}
                type="firstname"
                name="firstname"
                id="firstname"
                placeholder="Firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
              />
              <input
                className={styles.lastname}
                type="lastname"
                name="lastname"
                id="lastname"
                placeholder="Lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
              />
            </div>
            <div className={styles.errorContainer}>
              {errors &&
                errors.map((error) =>
                  error.path === "firstname" || error.path === "lastname" ? (
                    <li> {error.msg} </li>
                  ) : (
                    ""
                  )
                )}{" "}
            </div>
            <input
              className={styles.username}
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className={styles.errorContainer}>
              {errors &&
                errors.map((error) =>
                  error.path === "username" ? <li> {error.msg} </li> : ""
                )}
            </div>
            <input
              className={styles.email}
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className={styles.errorContainer}>
              {errors &&
                errors.map((error) =>
                  error.path === "email" ? <li> {error.msg} </li> : ""
                )}
            </div>
            <input
              className={styles.password}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className={styles.errorContainer}></div>
            <input
              className={styles.confirmPassword}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className={styles.errorContainer}>
              {errors &&
                errors.map((error) =>
                  error.path === "password" ||
                  error.path === "confirmPassword" ? (
                    <li> {error.msg} </li>
                  ) : (
                    ""
                  )
                )}
            </div>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default SignUp;
