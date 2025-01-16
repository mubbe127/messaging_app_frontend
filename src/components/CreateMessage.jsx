import { useEffect, useState, useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth.jsx";
import { useChat } from "./ChatProvider.jsx";
import likeImage from "../assets/like.svg";

import styles from "./CreateMessage.module.css";
import domainUrl from "../utils/domain.js";

function CreateMessage({ chatId, members }) {
  const [newMessage, setNewMessage] = useState("");
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const { authState } = useAuth();
  const navigate = useNavigate();
  const { sentMessage, setSentMessage } = useChat();
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [chatId, file]);

  useEffect(()=> {
    if(file) {
      setFile(null)
    }
   if(previewUrl){
    setPreviewUrl(null)
   }
  if(newMessage){
    setNewMessage("")
  }
  },[chatId, members])

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };


  async function createChat() {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${domainUrl}/api/chats`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberIds: members.map((member) => member.id),
          userId: authState.user.id,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      const data = response.json();
      console.log("succesfully created chat", data);
      return data;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async function createMessage(chatId, submitLike = null) {
    try {
      const formData = new FormData();
      if (submitLike) {
        formData.append("content", "LIKEISTRUEabcdefghijklm");
      } else {
        formData.append("content", newMessage);
      }
      const token = localStorage.getItem("accessToken");

      formData.append("chatId", chatId);
      formData.append("userId", authState.user.id);

      if (file) {
        formData.append("file", file);
      // Append the file if it exists
      }
      console.log(formData);
      const response = await fetch(`${domainUrl}/api/messages`, {
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
      setFile(null);
      if (fileRef.current) {
        fileRef.current.value = ""; // Clears the file input
      }
    } catch (error) {
      console.log(error);
    }
  }
  const submitMessage = async (event, submitLike = null) => {
    event.preventDefault();

    if (chatId && members) {
      const chat = await createMessage(chatId, submitLike);
      console.log("navigating ");
      navigate(`/chats/${chatId}`);
      setSentMessage({ true: true });
    } else if (!chatId && members) {
      console.log("navigating ");
      const chat = await createChat();
      const message = await createMessage(chat.id, submitLike);
      navigate(`/chats/${chat.id}`);
      setSentMessage({ true: true });
    } else if (chatId) {
      console.log("navigating ");
   
      const message = await createMessage(chatId, submitLike);
      console.log("right path");
      setSentMessage({ true: true });
   
    }
  };

  const submitLike = async (event) => {
    event.preventDefault();
    const submitLike = true;
    submitMessage(event, submitLike);
  };

  return (
    <div className={styles.createMessageContainer}>
      {file && (
        <div className={styles.fileContainer}>
          {file &&
          ["jpeg", "jpg", "image", "svg", "png"].some((substring) =>
            file.type.includes(substring)
          ) ? (
            <div key={file.id} className={`${styles.file} ${styles.image}`}>
              <img src={previewUrl ? previewUrl : ""} alt="" className={styles.fileImage}/>
              <div className={styles.removeButtonContainer} onClick={()=>setFile(null)}>
                <img
                  src="/icons/cancel.svg"
                  alt=""
                  className={styles.removeButton}
                />
              </div>
            </div>
          ) : file.type.includes("pdf") ? (
            <div className={styles.document}>
              <img src="/icons/pdf.svg" alt="" className={styles.icon} />
              <p>{file.name}</p>
              <div className={styles.removeButtonContainer} onClick={()=>setFile(null)}>
                <img
                  src="/icons/cancel.svg"
                  alt=""
                  className={styles.removeButton}
                />
              </div>
            </div>
          ) : ["sheet", "excel", "xls"].some((substring) =>
              file.type.includes(substring)
            ) ? (
            <div className={styles.document}>
              <img src="/icons/excel.svg" alt="" className={styles.icon}  />
              <div className={styles.removeButtonContainer} onClick={()=>setFile(null)}>
                <img
                  src="/icons/cancel.svg"
                  alt=""
                  className={styles.removeButton}
                />
              </div>
              <p>{file.name}</p>
            </div>
          ) : ["document", "docx"].some((substring) =>
              file.type.includes(substring)
            ) ? (
            <div className={styles.document}>
              <img src="/icons/docx.svg" alt="" className={styles.icon} />
              <div className={styles.removeButtonContainer} onClick={()=>setFile(null)}>
                <img
                  src="/icons/cancel.svg"
                  alt=""
                  className={styles.removeButton}
                />
              </div>
              <p>{file.name}</p>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
      <form action="" onSubmit={(e) => submitMessage(e)}>
        <label htmlFor="file" className={styles.labelIcon}>
          <img src="/icons/attach.svg" alt="" />
        </label>
        <input
          className={styles.fileInput}
          type="file"
          name="file"
          id="file"
          onChange={(e) => handleFileChange(e)}
          ref={fileRef}
        />
        <div
          className={`${styles.messageInputContainer} ${
            file ? styles.activeFile : ""
          }`}
        >
          <textarea
            name="content"
            id="content"
            className={`${styles.messageInput} ${
              file ? styles.activeFile : ""
            }`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent a new line in the textarea
                submitMessage(e); // Trigger form submission
              }
            }}
            ref={messageInputRef}
            placeholder="Aa"
          />
        </div>
        {(newMessage || file) && (
          <button className={styles.sendButton} type="submit">
            <img src="/icons/send.svg" alt="" />
          </button>
        )}
        {!newMessage && !file && (
          <button className={styles.likeButton} onClick={(e) => submitLike(e)}>
            <img src="/icons/like.svg" alt="" />
          </button>
        )}
      </form>
    </div>
  );
}

export default CreateMessage;
