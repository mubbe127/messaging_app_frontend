import Logout from "../components/Logout";
import { useState } from "react";
import AllChats from "../components/AllChats";
import { useAuth } from "../utils/useAuth";
import { Outlet } from "react-router-dom";
import CreateChat from "../components/CreateChat";
import styles from "./ChatPage.module.css";


function ChatPage() {
  const { authState } = useAuth();
    const [sentMessage, setSentMessage] = useState(false);

  return (
    <>
      <Logout />
      <div className={styles.chatPageContainer}>
        <AllChats sentMessage={sentMessage} />
        <Outlet context={{sentMessage, setSentMessage}}/>
      </div>
    </>
  );
}

export default ChatPage;
