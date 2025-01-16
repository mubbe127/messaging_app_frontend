import { useEffect, useState, useRef } from "react";
import { Navigate, useParams, useNavigate, Link,} from "react-router-dom";
import { useAuth } from "../utils/useAuth";
import domainUrl from "../utils/domain";
import styles from "./CreateChat.module.css";
import CreateMessage from "./CreateMessage";
import Messages from "./Messages";
import RenderProfileImage from "./RenderProfileImage";

function CreateChat() {
  const [searchedList, setSearchedList] = useState(null);
  const [chat, setChat] = useState({ members: [], messages: [] });
  const [addedMembers, setAddedMembers] = useState();
  const [searchInput, setSearchInput] = useState("");
  const { authState } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null)
 


  const { memberId } = useParams();

  const isMobile = window.innerWidth <= 768;

  const goBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  useEffect(() => {
    if (memberId) {
      const token = localStorage.getItem("accessToken");
      fetch(`${domainUrl}/api/users/${memberId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          addMember(response);
        });
    }
    // Create new array with the member
  }, []);
  useEffect(()=>{

    if(searchRef.current) {
      searchRef.current.focus()
    }
  },[addedMembers])
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
        `${domainUrl}/api/search/chats-users`,
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
    console.log("updatedmemebrs", updatedMembers);

    const token = localStorage.getItem("accessToken");

    setSearchInput("");
    setSearchedList(null);

    try {
      const response = await fetch(
        `${domainUrl}/api/search/chatbymembers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberIds: updatedMembers.map((member) => {
              console.log("kanske funkar", member);
              return member.id;
            }),
            userId: authState.user.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw error;
      }

      const data = await response.json();
      console.log("found chat", data?.foundchat);

      if (data.foundchat.length > 0) {
        console.log("set data", data);

        setChat(data.foundchat[0]);
      } else {
        setChat({ members: [], messages: [] });
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function addChat(chat) {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${domainUrl}/api/chats`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat,
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      const data = await response.json();
      console.log("succesful fetched", data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className={styles.createChatContainer}>
      {isMobile && (
        <div className={styles.header}>
          <div onClick={goBack} className={styles.cancel}>
            <p>Cancel</p>
          </div>

          <div className={styles.heading}>
            <h2>New message</h2>
          </div>
        </div>
      )}
      <div
        className={
          isMobile ? styles.searchContainerMobile : styles.searchContainer
        }
      >
        <div className={styles.addedMembersContainer}>
          <div className={styles.toContainer}>
            <p>Till:</p>
          </div>
          {addedMembers &&
            addedMembers.map((member) => (
              <div className={styles.addedMemberContainer} key={member.id}>
                <p>{member.firstname}</p>
                <p>{member.lastname}</p>

                <img
                  src="/icons/cancel.svg"
                  alt=""
                  className={styles.icon}
                  onClick={() => addMember(member)}
                />
              </div>
            ))}
          <div className={styles.searchListAndInputContainer}>
            <form action="">
              <input
                type="search"
                name="search"
                id="search"
                onChange={(e) => searchUser(e)}
                value={searchInput}
                autoComplete="off"
                ref={searchRef}
              />
            </form>
            {searchedList &&
              (searchedList.chats?.length > 0 || searchedList.users?.length) >
                0 && (
                <div className={styles.searchedListContainer}>
                  {searchedList.chats.map((searchedChat) => (
                    <Link
                      to={"/chats/" + searchedChat.id}
                      className={styles.searchedChatContainer}
                      key={searchedChat.id}
                      onClick={() => addChat(searchedChat)}
                    >
                      <RenderProfileImage
                        chat={searchedChat}
                        authState={authState}
                        size={50}
                      />
                      <p>{searchedChat.name}</p>
                    </Link>
                  ))}
                  {searchedList &&
                    searchedList.users.length > 0 &&
                    searchedList.users.map((searchedUser) => (
                      <div
                        className={styles.searchedUserContainer}
                        key={searchedUser.id}
                        onClick={() => addMember(searchedUser)}
                      >
                        <img
                          src={
                            searchedUser.profileImage
                              ? domainUrl + "/" +
                                searchedUser.profileImage
                              : "/icons/profile.svg"
                          }
                          alt=""
                        />
                        <p>
                          {searchedUser.firstname} {searchedUser.lastname}
                        </p>
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>
      </div>

      <Messages chat={chat} />
      <CreateMessage chatId={chat && chat.id} members={addedMembers} />
    </div>
  );
}

export default CreateChat;
