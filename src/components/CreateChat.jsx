import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

import styles from "./CreateChat.module.css";
import CreateMessage from "./CreateMessage";

function CreateChat() {
  const [searchedList, setSearchedList] = useState(null);
  const [chat, setChat] = useState(null);
  const [addedMembers, setAddedMembers] = useState();
  const [searchInput, setSearchInput] = useState("");
  const { authState } = useAuth();
  const navigate = useNavigate();

  async function searchUser(e) {
    const token = localStorage.getItem("accessToken");
    console.log(authState);
    setSearchInput(e.target.value);
    try {
      if (e.target.value === "") {
        setSearchedList(null);
        return;
      }
      const response = await fetch(
        `http://localhost:4100/api/search/chats-users`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: authState.user.id,
            searchTerm: e.target.value,
          }),
        }
      );
      if (!response.ok) {
        const error = response.json();
        throw error;
      }
      const data = await response.json();
      console.log(data);
      const filteredUsers = data.users.filter((user) => {
        return !addedMembers?.some((member) => member.id === user.id);
      });
      data.users = filteredUsers;
      setSearchedList(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function addMember(member) {
    // Update memberIds
    const existingMember = addedMembers?.some(
      (addedMember) => addedMember.id === member.id
    );

    // Update the addedMembers array based on existence
    const updatedMembers = existingMember
      ? addedMembers.filter((addedMember) => addedMember.id !== member.id) // Remove member
      : addedMembers
      ? [...addedMembers, member] // Add member to existing array
      : [member]; // Create new array with the member

    setAddedMembers(updatedMembers);
    console.log(updatedMembers); // This will correctly log the updated array

    const token = localStorage.getItem("accessToken");
    console.log(token);
    setSearchInput("");
    setSearchedList(null);

    try {
      const response = await fetch(
        `http://localhost:4100/api/search/chatbymembers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberIds: updatedMembers.map((member) => member.id),
            userId: authState.user.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const data = await response.json();
      console.log(data?.foundchat);

      if (data.foundchat.length > 0) {
        console.log("set data");
        setChat(data.foundchat[0]);
      } else {
        setChat();
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addChat() {}

  return (
    <div className={styles.createChatContainer}>
      <div className={styles.searchContainer}>
        <div className={styles.toContainer}>
          {" "}
          <p>Till:</p>
        </div>
        <div className={styles.addedMembersContainer}>
          {addedMembers &&
            addedMembers.map((member) => (
              <div className={styles.addedMemberContainer} key={member.id}>
                <p>
                  {member.firstname} {member.lastname}
                </p>

                <img
                  src="/icons/cancel.svg"
                  alt=""
                  className={styles.icon}
                  onClick={() => addMember(member)}
                />
              </div>
            ))}
        </div>
        <form action="">
          <input
            type="search"
            name="search"
            id="search"
            onChange={(e) => searchUser(e)}
            value={searchInput}
            autoComplete="off"
          />
        </form>
        <div className={styles.searchedListContainer}>
          {searchedList &&
            searchedList.chats.length > 0 &&
            searchedList.chats.map((searchedChat) => (
              <div
                className={styles.searchedChatContainer}
                key={searchedChat.id}
                onClick={() => addChat(searchedChat.id)}
              >
                <img src="" alt="" />
                <p>{searchedChat.name}</p>
              </div>
            ))}
          {searchedList &&
            searchedList.users.length > 0 &&
            searchedList.users.map((searchedUser) => (
              <div
                className={styles.searchedUserContainer}
                key={searchedUser.id}
                onClick={() => addMember(searchedUser)}
              >
                <img src="" alt="" />
                <p>
                  {searchedUser.firstname} {searchedUser.lastname}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className={styles.chatContainer}>
        {chat &&
          chat.messages.map((message) => (
            <div className={styles.messageContainer} key={message.id}>
              <p>{message.content}</p>
            </div>
          ))}
      </div>
      <CreateMessage chatId={chat && chat.id} members={addedMembers} />
    </div>
  );
}

export default CreateChat;
