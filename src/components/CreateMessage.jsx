import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth.jsx";

import styles from "./CreateMessage.module.css";

function CreateMessage({ chatId = null, members=null, setSentMessage=false }) {
  const [newMessage, setNewMessage] = useState("");
  const { authState } = useAuth();
  const navigate = useNavigate();

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
          memberIds: members.map(member=>member.id),
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
      const token = localStorage.getItem("accessToken");
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
      const data = await response.json();
      console.log("succesfully posted message", data);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  }

  const submitMessage = async (event) => {
    event.preventDefault();

    if (chatId && members) {
      const chat = await createMessage(chatId);
      navigate(`/chats/${chatId}`);
    } else if (!chatId && members) {
      const chat = await createChat();
      const message = await createMessage(chat.id);
      setSentMessage(true);
    } else if (chatId) {
      const message = await createMessage(chatId);
      setSentMessage(true);
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
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default CreateMessage;
