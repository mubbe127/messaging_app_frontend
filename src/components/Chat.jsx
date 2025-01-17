import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";

import { useAuth } from "../utils/useAuth";
import CreateMessage from "./CreateMessage";
import Messages from "./Messages";
import { useChat } from "./ChatProvider.jsx";
import { useNavigate } from "react-router-dom";
import EditChat from "./EditChat.jsx";
import styles from "./Chat.module.css";
import domainUrl from "../utils/domain.js";

function Chat() {
  const [chat, setChat] = useState({ members: [], messages: [] });
  const { authState } = useAuth();
  const { sentMessage, setSentMessage, viewedChatIds, setViewedChatIds } = useChat();
  const [showMembers, setShowMembers] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [editChat, setEditChat] = useState(false);
  const { chatId } = useParams();
  const optionsRef = useRef(null);
  const displayMemberRef = useRef(null);
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1); // Navigates to the previous page
  };
  // State to track if the screen is mobile size
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Effect to update the isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  async function getChat() {
    console.log(chatId);
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`${domainUrl}/api/chats/${chatId}`, {
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
  }, [sentMessage,chatId]);

  function displayMembers(e) {
    if (
      displayMemberRef.current &&
      !displayMemberRef.current.contains(e.target)
    ) {
      setShowMembers(false);
    }
  }
  function displayOptions(e) {
    if (optionsRef.current && !optionsRef.current.contains(e.target)) {
      setShowOptions(false);
    }
  }

  useEffect(() => {
    async function updateView() {
      try {
       
        const token = localStorage.getItem("accessToken")
        const response = await fetch(
          `${domainUrl}/api/messages/viewed`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json", // Add your API key to the headers
            },
            body: JSON.stringify({
              chatId: chat.id,
              userId: authState.user.id,
            }),
          }
        );
        if (!response.ok) {
          const error = await response.json();
          throw error;
        }
        const data = await response.json();
        console.log("successfully updated viewed messages", data);
    
      } catch (error) {
        console.log(error);
      }
    }
      if(chat.id && authState.isAuthenticated){
      updateView();
      setViewedChatIds([...viewedChatIds, chat.id])
    }
    
  }, [chat.id, authState, sentMessage]);


  return (
    <>
      {chat && !(isMobile && editChat) && authState.isAuthenticated && (
        <div className={styles.chatContainer}>
          <div className={styles.header}>
            <div className={styles.profileAndNamesContainer}>
              {isMobile && (
                <div className={styles.previousButtonContainer}>
                  {" "}
                  <img src="/icons/previous.svg" alt="" onClick={goBack} />
                </div>
              )}
              {chat.profileImage ? (
                <div
                  className={`${styles.profileImageContainer} ${styles.single}`}
                >
                  <img
                    src={domainUrl +"/" + chat.profileImage}
                    className={`${styles.profileImage0} ${styles.single}`}
                    alt=""
                  />
                </div>
              ) : (
                (() => {
                  let memberIds = [];
                  if (chat.messages.length > 0) {
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
                  const selectedMembers = memberIds
                    .map((memberId) =>
                      chat.members.find((member) => member.id === memberId)
                    )
                    .filter((member) => member !== undefined);
                  console.log("selectedmemebers", selectedMembers);

                  return (
                    <div
                      className={`${styles.profileImageContainer} ${
                        selectedMembers.length === 1 ? styles.single : null
                      }`}
                    >
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
                              ? domainUrl +"/" + member.profileImage
                              : "/icons/profile.svg"
                          }
                          alt=""
                        />
                      ))}
                    </div>
                  );
                })()
              )}

              <div
                className={styles.chatNamesContainer}
                onClick={() => setShowMembers(true)}
              >
                {chat && chat.name ? (
                  <div className={styles.chatNames}>
                    <p>{chat.name}</p>
                  </div>
                ) : (
                  <div className={styles.chatNames}>
                    {chat &&
                      chat.members &&
                      chat.members.map((member) => {
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
              </div>
            </div>

            <div
              className={styles.editChatButton}
              onClick={() => setEditChat(!editChat)}
            >
              <img src="/icons/options.svg" alt="" />
            </div>
            {showMembers && (
              <div
                className={styles.membersContainerBackground}
                onClick={(e) => {
                  displayMembers(e);
                  displayOptions(e);
                }}
              >
                <div className={styles.membersContainer} ref={displayMemberRef}>
                  <div className={styles.heading}>
                    <h2>Members</h2>
                  </div>
                  <div
                    className={styles.cancelContainer}
                    onClick={() => setShowMembers(false)}
                  >
                    <img
                      src="/icons/cancel.svg"
                      alt=""
                      onClick={() => setShowMembers(false)}
                    />
                  </div>
                  {chat &&
                    chat.members.map((member) => (
                      <div key={member.id} className={styles.memberContainer}>
                        <Link
                          to={"/new/" + member.id}
                          className={styles.memberLink}
                        >
                          <div className={styles.profileImage}>
                            <img
                              src={
                                member.profileImage
                                  ? domainUrl + "/" +
                                    member.profileImage
                                  : "/icons/profile.svg"
                              }
                              alt=""
                            />
                          </div>

                          <p className={styles.name}>
                            {member.firstname} {member.lastname}
                          </p>
                        </Link>
                        <img
                          src="/icons/options.svg"
                          alt=""
                          onClick={() => setShowOptions(member.id)}
                          className={styles.clickOptions}
                        />
                        {showOptions && showOptions === member.id && (
                          <div
                            className={styles.optionsContainer}
                            ref={optionsRef}
                          >
                            <Link to={"/chats/new/" + member.id}>
                              Skicka meddelande
                            </Link>
                            <Link to={"/users/" + member.id}> Visa profil</Link>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          <Messages chat={chat} />
          <CreateMessage chatId={chatId} />
        </div>
      )}
      {editChat && <EditChat chat={chat} setEditChat={setEditChat} />}
    </>
  );
}

export default Chat;
