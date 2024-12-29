import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

import styles from "./Chat.module.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { chatId } = useParams();
  const { authState } = useAuth();

  async function getChat() {
    const response = await fetch(
      `http://localhost:4100/api/chats/${chatId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Add your API key to the headers
        },
      }
    );
    if (!response.ok) {
      let error = await response.json();
      throw error;
    }
    const data = await response.json();
    console.log("Chat data fetched", data);
    setMessages(data.messages);
  }
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    getChat();
  }), [];

  const submitMessage = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`http://localhost:4100/api/messages`, {
        method: "Post",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newMessage,
          chatId,
          userId: authState.user.id,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      const data = response.json();
      console.log("succesfully posted message", data)
      setNewMessage("")
      getChat()
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messagesContainer}>
        {messages &&
          messages.map((message) => (
            <div className={styles.messageContainer} key={message.id}>
              <p>{message.content}</p>
            </div>
          ))}
      </div>
      <div className={styles.createMessage}>
        <form action="" onSubmit={(e) => submitMessage(e)}>
          <textarea
            name="content"
            id="content"
            className={styles.content}
            value={newMessage}
            onChange={() => setNewMessage(e.target.value)}
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
