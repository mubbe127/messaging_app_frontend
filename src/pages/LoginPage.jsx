import Header from "../components/Header";
import Login from "../components/Login";
import { useAuth } from "../utils/useAuth";
import { Navigate, Link } from "react-router-dom";
import styles from "./LoginPage.module.css"

function LoginPage() {
  const { authState } = useAuth();

  return (
    <>

      {authState.loading ? (
        <div>Loading</div>
      ) : !authState.isAuthenticated ? (
        <>
        <Header/>
        <Login />
        <div className={styles.signupLinkContainer}>
          <Link to="/signup" >Sign up to Messenger here</Link>
        </div>
        </>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}

export default LoginPage;
