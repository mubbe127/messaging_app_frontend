import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth.jsx";
import styles from "./Logout.module.css"

function Logout() {
  const { authState, setAuthState } = useAuth();
  const navigate = useNavigate()



  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await fetch(`http://localhost:4100/api/users/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add your API key to the headers
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });
    const data = await response.json();
    console.log(data)
    
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setAuthState({ isAuthenticated: false, loading: false, user:null });
    navigate("/login")

  };

  return (
    <>
      {authState.isAuthenticated && (
        <div className={styles.logout}>
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}

export default Logout;
