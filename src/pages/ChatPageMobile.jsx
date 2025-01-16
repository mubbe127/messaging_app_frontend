import Logout from "../components/Logout";
import Header from "../components/Header";
import { useState } from "react";
import AllChats from "../components/AllChats";
import { useAuth } from "../utils/useAuth";
import { Outlet } from "react-router-dom";
import CreateChat from "../components/CreateChat";
import styles from "./ChatPage.module.css";
import { ChatProvider } from "../components/ChatProvider";

function ChatPageMobile() {
  const { authState } = useAuth();
  
  const isMobile = window.innerWidth <= 768;

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
