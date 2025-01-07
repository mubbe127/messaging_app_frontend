import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import CreateMessage from "./CreateMessage";
import Messages from "./Messages";

import styles from "./Chat.module.css";

function Chat() {
  const [chat, setChat] = useState({ members: [], messages: [] });
  const { authState } = useAuth();
  const { sentMessage, setSentMessage} = useOutletContext(); 
  const [showMembers, setShowMembers] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const { chatId } = useParams();
  const optionsRef = useRef(null);
  const displayMemberRef = useRef(null);

  async function getChat() {
    console.log(chatId);
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
  }, [sentMessage, chatId]);

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
  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
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
                    return <p key={member.id}>{member.firstname}</p>;
                  } else {
                    return authState.user && member.id !== authState.user.id ? (
                      <p key={member.id}>{member.firstname}</p>
                    ) : null;
                  }
                })}
            </div>
          )}
        </div>
        {showMembers && (
          <div
            className={styles.displayMembersContainer}
            onClick={(e) => {
              displayMembers(e);
              displayOptions(e);
            }}
          >
            <div className={styles.displayMembers} ref={displayMemberRef}>
              <div className={styles.heading}>
                <h2>Members</h2>
              </div>
              <div className={styles.cancelContainer} onClick={()=>setShowMembers(false)}>
                <img
                  src="/icons/cancel.svg"
                  alt=""
                  onClick={() => setShowMembers(false)}
                />
              </div>
              {chat &&
                chat.members.map((member) => (
                  <div key={member.id} className={styles.memberContainer}>
                    <Link to={"/chats/new/" + member.id}>
                      <p>
                        {member.firstname} {member.lastname}
                      </p>
                    </Link>
                    <img
                      src="/icons/options.svg"
                      alt=""
                      onClick={() => setShowOptions(member.id)}
                      className={styles.showOptions}
                    />
                    {showOptions && showOptions === member.id && (
                      <div className={styles.displayOptions} ref={optionsRef}>
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
      <CreateMessage chatId={chatId} setSentMessage={setSentMessage} />
    </div>
  );
}

export default Chat;
