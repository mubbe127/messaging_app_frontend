import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useChat } from "./ChatProvider.jsx";
import RenderProfileImage from "./RenderProfileImage.jsx";
import { useAuth } from "../utils/useAuth";
import styles from "./AllChats.module.css";
import domainUrl from "../utils/domain.js";

function AllChats() {
  const { authState } = useAuth();
  const [chats, setChats] = useState([]);
  const { chatId } = useParams();
  const { sentMessage, setSentMessage, viewedChatIds, setViewedChatIds} = useChat();
  const isMobile = window.innerWidth <= 768;

  async function getChats() {
    const token = localStorage.getItem("accessToken");
    console.log("fetching all data")
    try {
      const response = await fetch(`${domainUrl}/api/chats`, {
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
    if (!authState.isAuthenticated) {
      console.log("No authstate");
      return;
    }
    getChats();
  }, [authState.isAuthenticated, sentMessage]);


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
          <Link
            to={`/chats/${chat.id}`}
            className={`${styles.linkContainer} ${styles.chatContainer}`}
            key={chat.id}
          >
            <RenderProfileImage
              chat={chat}
              authState={authState}
              size={isMobile ? 55 : 80}
            />
            <div className={styles.chatNamesAndMessage}>
              {chat.name ? (
                <div className={styles.chatNames}>
                  <p>{chat.name} </p>
                </div>
              ) : (
                <div className={styles.chatNames}>
                  {chat.members.map((member) => {
                    if (chat.members.length === 1) {
                      return (
                        <p key={member.id}>
                          {member.firstname}
                          {member.id !==
                            chat.members[chat.members.length - 1].id && ","}
                        </p>
                      );
                    } else {
                      return authState.user &&
                        member.id !== authState.user.id ? (
                        <p key={member.id}>
                          {member.firstname}
                          {member.id !==
                            chat.members[chat.members.length - 1].id &&
                            !(
                              authState.user.id ===
                                chat.members[chat.members.length - 1].id &&
                              member.id ===
                                chat.members[chat.members.length - 2].id
                            ) &&
                            ","}
                        </p>
                      ) : null;
                    }
                  })}
                </div>
              )}
              <div className={`${styles.latestMessage} ${(viewedChatIds.includes(chat.id) || chat.messages[chat.messages.length - 1].viewedBy.some(user => user.id===authState.user.id)) ? styles.read : styles.notRead}`}>
                {chat && chat.messages && chat.messages.length > 0 ? (
                  <>
                    <>
                      {authState.user &&
                      chat.messages[chat.messages.length - 1].userId ===
                        authState.user.id ? (
                        <p>Du:</p>
                      ) : (
                        <p>
                          
                          {chat.members.find(
                            (member) =>
                              member.id ===
                              chat.messages[chat.messages.length - 1].userId
                          ).firstname + ":"}
                        </p>
                      )}
                    </>

                    {chat.messages[chat.messages.length - 1].files.length >
                    0 ? (
                      <p>"sent a file" </p>
                    ) : chat.messages[chat.messages.length - 1].content ===
                      "LIKEISTRUEabcdefghijklm" ? (
                      <img className={styles.likeImage} src="/icons/like.svg" />
                    ) : (
                      <p>{chat.messages[chat.messages.length - 1].content}</p>
                    )}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </Link>
        ))}
    </div>
  );
}

export default AllChats;
