import Logout from "../components/Logout";
import Header from "../components/Header";
import { useState } from "react";
import AllChats from "../components/AllChats";
import { useAuth } from "../utils/useAuth";
import { Outlet } from "react-router-dom";
import CreateChat from "../components/CreateChat";
import styles from "./ChatPage.module.css";
import { ChatProvider } from "../components/ChatProvider";


function ChatPage() {
  const { authState } = useAuth();
    

  return (
    <>
    <ChatProvider>
      <Header />
      <div className={styles.chatPageContainer}>
        <AllChats />
        <Outlet />
      </div>
      </ChatProvider>
    </>
  );
}

export default ChatPage;
