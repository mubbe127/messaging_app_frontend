import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useChat } from "./ChatProvider.jsx";

import { useAuth } from "../utils/useAuth";

import styles from "./AllChats.module.css";

function AllChats() {
  const { authState } = useAuth();
  const [chats, setChats] = useState([]);
  const { chatId } = useParams();
  const { sentMessage } = useChat();

  async function getChats() {
    const token = localStorage.getItem("accessToken");

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
    if (!authState.isAuthenticated) {
      console.log("No authstate");
      return;
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
            <Link to={`/chats/${chat.id}`} className={styles.linkContainer}>
              {chat.profileImage ? (
                <div>
                  <img
                    src={"http://localhost:4100/" + chat.profileImage}
                    alt=""
                  />
                </div>
              ) : (
                (() => {
                  let memberIds = [];
                  // Loop through messages in reverse order
                  for (let i = chat.messages.length - 1; i >= 0; i--) {
                    if (!memberIds.includes(chat.messages[i].userId)) {
                      if (chat.messages[i].userId !== authState.user.id) {
                        memberIds.push(chat.messages[i].userId);
                      }
                    }
                    if (memberIds.length === 2) {
                      break; // Stop once we have 2 unique members
                    }
                  }
                  if (memberIds.length < 2) {
                    chat.members.forEach((member) => {
                      if (
                        member.id !== authState.user.id &&
                        !memberIds.includes(member.id) &&
                        memberIds.length < 2
                      ) {
                        memberIds.push(member.id);
                      }
                    });
                  }

                  if (memberIds.length === 0 && chat.members.length === 1) {
                    memberIds.push(chat.members[0].id);
                  }

                  // Use .find() to get the member data
                  const selectedMembers = memberIds
                    .map((memberId) =>
                      chat.members.find((member) => member.id === memberId)
                    )
                    .filter((member) => member !== undefined);

                  return (
                    <div className={styles.profileImageContainer}>
                      {selectedMembers.map((member, index) => (
                        <img
                          key={member.id}
                          className={`${styles.profileImage} ${
                            styles["profileImage" + index]
                          } ${
                            selectedMembers.length === 1 ? styles.single : null
                          }`}
                          src={
                            member.profileImage
                              ? "http://localhost:4100/" + member.profileImage
                              : "/icons/profile.svg"
                          }
                          alt=""
                        />
                      ))}
                    </div>
                  );
                })()
              )}
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
                      
                        {chat.messages[chat.messages.length - 1].files.length >
                        0
                          ? <p>"sent a file" </p>
                          : chat.messages[chat.messages.length - 1].content==="LIKEISTRUEabcdefghijklm" ? (<img className={styles.likeImage} src="/icons/like.svg"/>) : 
                          <p>{chat.messages[chat.messages.length - 1].content}</p>}
                     
                    </>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}

export default AllChats;
