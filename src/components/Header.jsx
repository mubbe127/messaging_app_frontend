import { useState, useEffect } from "react";
import Logout from "./Logout";
import LoginLink from "./LoginLink";
import styles from "./Header.module.css";

function Header() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.heading}>
          <p>Welcome to Mobes Blog</p>
        </div>
        <div className={styles.buttonUsernameContainer}>
            <div className={styles.username}><p>{user && user.username}</p></div>
          <div className={styles.buttonContainer}>
            <Logout setUser={setUser} setToken={setToken}/>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
