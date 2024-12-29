import Login from "../components/Login";
import { useAuth } from "../utils/useAuth";
import { Navigate } from "react-router-dom";


function LoginPage() {
  const { authState } = useAuth();

  return <>{authState.loading ? <div>Loading</div> : 
  !authState.isAuthenticated ? <Login /> : <Navigate to="/home"/>}</>;
}

export default LoginPage;
