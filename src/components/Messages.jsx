import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import formatDate from "../utils/utils";

import styles from "./Messages.module.css";

function Messages({ chat}) {


  const { authState } = useAuth();
  const { chatId } = useParams();

  console.log("from message component", chat)
  const memberMap = useMemo(() => {
    const map = {};
    chat.members.forEach((member) => (map[member.id] = member));
    console.log(map);
    return map;
  }, [chat.members]);
  let lastMessage = {time:0, user: null};  
  return (
    <div className={styles.messagesContainer}>
      {chat &&
        chat.messages.map((message, index) => {
      
          const messageDate = new Date(message.createdAt).getTime();
          const messageUser = message.userId
          let postDate = false;
          let postUser=false

          if (
            index === 0 ||
            messageDate >
              lastMessage.time + 1000 * 60 * 30
          ) {
            lastMessage.time=messageDate
            postDate = true;    
            postUser=true
          }

          if(index===0 || messageUser!==lastMessage.user){
            lastMessage.user=messageUser
            postUser=true
          }

          return (
            <div className={ message.userId===authState?.user?.id ? `${styles.creator} ${styles.messageContainer}` : styles.messageContainer} key={message.id}>
              {/* Displaying formatted date */}
              {postDate && <div  className={styles.date}><p>{formatDate(message.createdAt)}</p></div>}
              {postUser && <div className={styles.user}><p >{(memberMap[message.userId]?.firstname || "Unknown User")}</p></div>}
              <div className={styles.content}><p >{message.content}</p></div>
              <div className={styles.files}>{message.files.map(file => {
                  if(file && file.fileType.includes("image")){
                  return (
                    <div key={file.id} className={`${styles.file} ${styles.image}`}><img src={"http://localhost:4100/" + file.filePath} alt="" /></div>
                  )
                } else return "hej"
                
              })}</div>
            </div>
          );
        })}
    </div>
  );
}

export default Messages;
