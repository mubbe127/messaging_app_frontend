import Logout from "../components/Logout";
import AllChats from "../components/AllChats";
import { useAuth } from "../utils/useAuth";
import { Outlet } from "react-router-dom";

function ChatPage() {
  const { authState } = useAuth();
  const token = localStorage.getItem("refreshToken");

  return (
    <>
      <Logout />
      <AllChats />
      
      <Outlet />
    </>
  );
}

export default ChatPage;
