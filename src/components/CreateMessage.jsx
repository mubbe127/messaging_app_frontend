import { useEffect, useState, useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth.jsx";


import styles from "./CreateMessage.module.css";

function CreateMessage({ chatId = null, members=null, setSentMessage=false }) {
  const [newMessage, setNewMessage] = useState("");
  const fileRef = useRef(null)
  const [file, setFile]= useState(null)
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
      const formData = new FormData();
      formData.append("content", newMessage);
      formData.append("chatId", chatId);
      formData.append("userId", authState.user.id);

      if (file) {
        formData.append("file", file); // Append the file if it exists
      }
      const response = await fetch(`http://localhost:4100/api/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        
        },
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      const data = await response.json();
      console.log("succesfully posted message", data);
      setNewMessage("");
      setFile(null)
      if (fileRef.current) {
        fileRef.current.value = ""; // Clears the file input
      }
    } catch (error) {
      console.log(error);
    }
  }

  const submitMessage = async (event) => {
    event.preventDefault();

    if (chatId && members) {
      const chat = await createMessage(chatId);
      console.log("navigating ")
      navigate(`/chats/${chatId}`);
    } else if (!chatId && members) {
      console.log("navigating ")
      const chat = await createChat();
      const message = await createMessage(chat.id);
      navigate(`/chats/${chat.id}`);
      setSentMessage(true);
    } else if (chatId) {
      console.log("navigating ")
      const message = await createMessage(chatId);
      setSentMessage({true:true});
    }
  };

  return (
    <div className={styles.createMessageContainer}>
      <form action="" onSubmit={(e) => submitMessage(e)}>
        <input type="file" name="file" id="file"  onChange={(e) => setFile(e.target.files[0])} ref={fileRef}/>
        <textarea
          name="content"
          id="content"
          className={styles.content}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // Prevent a new line in the textarea
              submitMessage(e);   // Trigger form submission
            }
          }}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default CreateMessage;
