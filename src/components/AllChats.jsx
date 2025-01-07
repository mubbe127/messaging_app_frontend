import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

import styles from "./AllChats.module.css";

function AllChats({sentMessage}) {
  const { authState } = useAuth();
  const [chats, setChats] = useState([]);
  const {chatId} = useParams()

  async function getChats() {
    const token = localStorage.getItem("accessToken");
    console.log(authState);
    try {
      const response = await fetch(`http://localhost:4100/api/chats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Add your API key to the headers
        },
      });
      if (!response.ok) {
        let error = await response.json();
        console.log(error);
        throw error;
      }
      const data = await response.json();
      console.log("AllChat data fetched", data);
      setChats(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if(!authState.isAuthenticated){
      console.log("No authstate")
      return
    }
    getChats();
  }, [chatId, authState.isAuthenticated, sentMessage]);

  return (
    <div className={styles.chatsContainer}>
      <div className={styles.heading}>
        <h2>Chats</h2>{" "}
        <Link to="new" className={styles.createPostContainer}>
          <img src="/icons/create-note.svg" alt="" />
        </Link>
      </div>

      {chats &&
        chats.map((chat) => (
          <div className={styles.chatContainer} key={chat.id}>
            <Link to={`${chat.id}`}>
              {chat.name ? (
                <div className={styles.chatNames}>
                  <p>{chat.name}</p>
                </div>
              ) : (
                <div className={styles.chatNames}>
                  {chat.members.map((member) => {
                    if (chat.members.length === 1) {
                      return <p key={member.id}>{member.firstname}</p>;
                    } else {
                      return authState.user &&
                        member.id !== authState.user.id ? (
                        <p key={member.id}>{member.firstname}</p>
                      ) : null;
                    }
                  })}
                </div>
              )}
              <div className={styles.latestMessage}>
                {chat && chat.messages && chat.messages.length > 0 ? (
                  <>
                    <p>
                      {authState.user &&
                      chat.messages[chat.messages.length - 1].userId ===
                        authState.user.id
                        ? "Du:"
                        : chat.members.find(
                            (member) =>
                              member.id ===
                              chat.messages[chat.messages.length - 1].userId
                          ).firstname + ":"}
                    </p>
                    <p>{chat.messages[chat.messages.length - 1].content}</p>
                  </>
                ) : (
                  ""
                )}
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}

export default AllChats;
