import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { AuthProvider } from "./utils/useAuth.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>  {/* Ensure BrowserRouter is at the top */}
      <AuthProvider>  {/* AuthProvider is inside BrowserRouter */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;