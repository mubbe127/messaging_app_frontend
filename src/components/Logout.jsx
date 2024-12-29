import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth.jsx";

function Logout() {
  const { authState, setAuthState } = useAuth();



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
  };

  return (
    <>
      {authState.isAuthenticated && (
        <div className="logout">
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </>
  );
}

export default Logout;
