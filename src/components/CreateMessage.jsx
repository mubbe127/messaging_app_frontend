import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

import styles from "./Chat.module.css";

function CreateMessage({ chatId = null, members }) {
  const [newMessage, setNewMessage] = useState("");
  const { authState } = useAuth();
  const navigate = useNavigate()

  async function createChat() {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`http://localhost:4100/api/chats`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          members,
          userId: authState.user.id,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      const data = response.json();
      console.log("succesfully posted message", data);
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async function createMessage(chatId) {
    try {
      const response = await fetch(`http://localhost:4100/api/messages`, {
        method: "POST",
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
      console.log("succesfully posted message", data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  }

  const submitMessage = async (event) => {
    event.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!chatId) {
      const chat = await createChat();
      const message = await createMessage(chat.id);
      navigate(`/${chat.id}`)

    } else {
      const chat = await createMessage(chatId);
    }
  };

  return (
    <div className={styles.createMessage}>
      <form action="" onSubmit={(e) => submitMessage(e)}>
        <textarea
          name="content"
          id="content"
          className={styles.content}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default CreateMessage;
