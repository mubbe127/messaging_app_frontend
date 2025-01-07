import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import { AuthProvider } from "./utils/useAuth.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Chat from "./components/Chat.jsx";
import CreateChat from "./components/CreateChat.jsx";
import CreateMessage from "./components/CreateMessage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      {" "}
      {/* Ensure BrowserRouter is at the top */}
      <AuthProvider>
        {" "}
        {/* AuthProvider is inside BrowserRouter */}
        <Routes>
          <Route path="/" element={<ChatPage />}>
            <Route path="new/:memberId?" element={<CreateChat />} />
            <Route path=":chatId" element={<Chat />} />
            <Route index element={<CreateChat />} />
          </Route>
          <Route path="/home" element={<ChatPage />}>
            <Route index element={<CreateChat />} />
            <Route path="new/:memberId?" element={<CreateChat />} />
            <Route path=":chatId" element={<Chat />} />
          </Route>
          <Route path="/chats" element={<ChatPage />}>
            <Route index element={<CreateChat/>} />
            <Route path="new/:memberId?" element={<CreateChat />} />
            <Route path=":chatId" element={<Chat />} />
          </Route>
          <Route path="/users/:userId" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
