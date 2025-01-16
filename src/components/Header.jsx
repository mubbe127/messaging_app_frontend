import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import styles from "./Header.module.css";
import { useAuth } from "../utils/useAuth.jsx";

function Header() {
  const { authState, setAuthState } = useAuth();


  return (
    <>
      <div className={styles.header}>
        <div className={styles.heading}>
          <p>Messenger</p>
        </div>
        <div className={styles.buttonUsernameContainer}>
            
          <div className={styles.buttonContainer}>

            {!authState.isAuthenticated && <Link to="/signup" className={styles.signupLink}>Sign up</Link> }
            <Logout />
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
