import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import CreateMessage from "./CreateMessage";

import styles from "./Chat.module.css";

function Chat() {
  const [chat, setChat] = useState();
  const { authState } = useAuth();
  const [sentMessage, setSentMessage]=useState(false)
  const {chatId} = useParams()
  async function getChat() {
    console.log(chatId)
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:4100/api/chats/${chatId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // Add your API key to the headers
      },
    });
    if (!response.ok) {
      let error = await response.json();
      throw error;
    }
    const data = await response.json();
    console.log("Chat data fetched", data);
    setChat(data);
  }
  useEffect(() => {
   
      getChat();
      setSentMessage(false)
    
  }, [sentMessage]);



  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
       
      </div>
      <div className={styles.messagesContainer}>
        {chat &&
          chat.messages.map((message) => (
            <div className={styles.messageContainer} key={message.id}>
              <p>{message.content}</p>
            </div>
          ))}
      </div>
      <CreateMessage chatId={chatId} setSentMessage={setSentMessage}/>
    </div>
  );
}

export default Chat;
