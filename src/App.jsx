import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./utils/useAuth.jsx";
import AllChats from "./components/AllChats.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ChatPageMobile from "./pages/ChatPageMobile.jsx";
import Chat from "./components/Chat.jsx";
import CreateChat from "./components/CreateChat.jsx";
import CreateMessage from "./components/CreateMessage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import "./App.css";

function App() {

  const isMobile = window.innerWidth <= 768;
  console.log(isMobile)
  return (
    <BrowserRouter>
    
      <AuthProvider>
      
        <Routes>
          <Route path="/" element={isMobile ? <ChatPageMobile/> : <ChatPage  />}>
            {isMobile && <Route index element={<AllChats />} />}
            <Route path="new/:memberId?" element={<CreateChat />} />
            <Route path="chats/:chatId" element={<Chat />} />
            {!isMobile && <Route index element={<CreateChat />} />}
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
