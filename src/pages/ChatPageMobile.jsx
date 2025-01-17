import Logout from "../components/Logout";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import AllChats from "../components/AllChats";
import { useAuth } from "../utils/useAuth";
import { Outlet } from "react-router-dom";
import CreateChat from "../components/CreateChat";
import styles from "./ChatPage.module.css";
import { ChatProvider } from "../components/ChatProvider";

function ChatPageMobile() {
  const { authState } = useAuth();
  
   // State to track if the screen is mobile size
   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

   // Effect to update the isMobile state on window resize
   useEffect(() => {
     const handleResize = () => {
       setIsMobile(window.innerWidth <= 768);
     };
 
     // Add event listener
     window.addEventListener("resize", handleResize);
 
     // Cleanup event listener on component unmount
     return () => {
       window.removeEventListener("resize", handleResize);
     };
   }, []);
 

  return (
    <>
      <ChatProvider>
        <div className={styles.chatPageContainer}>
          <Outlet />
        </div>
      </ChatProvider>
    </>
  );
}

export default ChatPageMobile;
