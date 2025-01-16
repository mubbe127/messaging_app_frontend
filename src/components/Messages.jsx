import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import formatDate from "../utils/utils";

import styles from "./Messages.module.css";
import { useChat } from "./ChatProvider";
import domainUrl from "../utils/domain";

function Messages({ chat }) {
  const { authState } = useAuth();
  const { chatId } = useParams();
  const containerRef = useRef()
  const {sentMessage}= useChat()
  const [reRender, setReRender]= useState(false)


  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setTimeout(()=>{
        container.scrollTop = container.scrollHeight;
      }, 10)
      
    }
  }, [chat, sentMessage, reRender]);


  const memberMap = useMemo(() => {
    const map = {};

    chat.members.forEach((member) => (map[member.id] = member));
  
    return map;
  }, [chat.members]);
 
  let lastMessage = { time: 0, user: null, profileImage:null, };
  return (
    <div className={styles.messagesContainer} ref={containerRef}>
      {chat && chat.messages.length>0 &&
        chat.messages.map((message, index) => {
          const messageDate = new Date(message.createdAt).getTime();
          const messageUser = message.userId;
          let postDate = false;
          let postUser = false;
          let profileImage = false

          if (index === 0 || messageDate > lastMessage.time + 1000 * 60 * 30) {
            lastMessage.time = messageDate;
            postDate = true;
            postUser = true;
         
          }
          if(!chat.messages[index+1] || chat.messages[index+1].userId !==messageUser || (new Date(chat.messages[index+1].createdAt).getTime() > lastMessage.time + 1000*60*30)) {
            profileImage=true
          }

          if (index === 0 || messageUser !== lastMessage.user) {
            lastMessage.user = messageUser;
            postUser = true;
          }

       

          return (
            <div
              className={
                message.userId === authState?.user?.id
                  ? `${styles.creator} ${styles.messageContainer}`
                  : styles.messageContainer
              }
              key={message.id}
            >
              {/* Displaying formatted date */}
              {postDate && (
                <div className={styles.date}>
                  <p>{formatDate(message.createdAt)}</p>
                </div>
              )}
              {postUser && (
                <div className={styles.user}>
                  <p>
                    {memberMap[message.userId]?.firstname || "Unknown User"}
                  </p>
                </div>
              )}
              {message.content && message.content==="LIKEISTRUEabcdefghijklm" &&
                (<div className={styles.likeContainer}>
                  <img src="/icons/like.svg" alt="" />
                </div>) }
          
              {message.content && message.content!=="LIKEISTRUEabcdefghijklm"  &&
              (<div className={styles.content}>
                  <p>{message.content}</p>
                </div>
              )}
              {profileImage && (
                <div className={`${styles.profileImage} ${!memberMap[message.userId]?.profileImage ? styles.iconProfile : null} `}>
                  <img src={memberMap[message.userId]?.profileImage ? domainUrl + memberMap[message.userId]?.profileImage : "/icons/profile.svg" } alt="" />
                </div>
              )}
              <div className={styles.files}>
                {message.files?.length>0 && message.files.map((file) => {
                  if (["jpeg", "jpg", "image", "svg"].some((substring) =>
                    file.fileType.includes(substring)
                  )) {
                    return (
                      <div
                        key={file.id}
                        className={`${styles.file} ${styles.image}`}
                      >
                        <img
                          src={domainUrl + "/" +file.filePath}
                          alt=""
                          onLoad={()=>setReRender(true)}
                        />
                      </div>
                    );
                  } else if (file.fileType.includes("pdf")) {
                    return (
                      <Link
                        key={file.id}
                        to={domainUrl +"/" + file.filePath}
                        className={styles.document}
                      >
                        <img
                          src="/icons/pdf.svg"
                          alt=""
                          className={styles.icon}
                          onLoad={()=>setReRender(true)}
                        />
                        <p>{file.fileName}</p>
                      </Link>
                    );
                  } else if (
                    ["sheet", "excel", "xls"].some((substring) =>
                      file.fileType.includes(substring)
                    )
                  ) {
                    return (
                      <Link
                        key={file.id}
                        to={domainUrl +"/"+ file.filePath}
                        className={styles.document}
                      >
                        <img
                          src="/icons/excel.svg"
                          alt=""
                          className={styles.icon}
                          onLoad={()=>setReRender(true)}
                        />
                        <p>{file.fileName}</p>
                      </Link>
                    );
                  } else if (
                    ["document", "docx"].some((substring) =>
                      file.fileType.includes(substring)
                    )
                  ) {
                    return (
                      <Link
                        key={file.id}
                        to={domainUrl +"/" + file.filePath}
                        className={styles.document}
                      >
                        <img
                          src="/icons/docx.svg"
                          alt=""
                          className={styles.icon}
                          onLoad={()=>setReRender(true)}
                        />
                        <p>{file.fileName}</p>
                      </Link>
                    );
                  }
                })}
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default Messages;
