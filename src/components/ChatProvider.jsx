import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [sentMessage, setSentMessage] = useState(false);
  const [viewedChatIds, setViewedChatIds]=useState([])

  return (
    <ChatContext.Provider value={{ sentMessage, setSentMessage, viewedChatIds, setViewedChatIds }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);