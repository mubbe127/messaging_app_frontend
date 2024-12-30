import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

import styles from "./AllChats.module.css";

function AllChats() {
  const { authState } = useAuth();
  const [chats, setChats] = useState([]);

  async function getChats(e) {
    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`http://localhost:4100/api/chats/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Add your API key to the headers
        },
        body: JSON.stringify({
          userId: authState.user.id,
          search: e.target.value,
        }),
      });
      if (!response.ok) {
        let error = await response.json();
        throw error;
      }
      const data = await response.json();
      console.log("Chat data fetched", data);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getChats();
  }, []);

  return (
    <div className={styles.chatsContainer}>
      {chats &&
        chats.map((chat) => (
          <div className={styles.chatContainer} key={chat.id}>
            <Link to={chat.id}>
              {chat.name ? (
                <p>{chat.name}</p>
              ) : (
                chat.members.map((member) => (
                  <div key={member.id}>
                    {member.firstname && member.lastname}
                  </div>
                ))
              )}
            </Link>
          </div>
        ))}
    </div>
  );
}

export default AllChats;
