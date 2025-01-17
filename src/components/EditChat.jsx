import { useAuth } from "../utils/useAuth";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useChat } from "./ChatProvider";
import RenderProfileImage from "./RenderProfileImage";

import styles from "./EditChat.module.css";
import Chat from "./Chat";
import domainUrl from "../utils/domain";

function EditChat({ chat, setEditChat }) {
  const { authState } = useAuth();
  const [options, setOptions] = useState(null);
  const [displayUpdateChatNameForm, setDisplayUpdateChatNameForm] =
    useState(null);

  const optionsButtonRefs = useRef({});
  const optionsRef = useRef(null);
  const chatNameFormButtonRef = useRef(null);
  const chatNameFormRef = useRef(null);
  const addMemberFormRef = useRef(null);
  const displayAddMemberButtonRef= useRef(null)
  const [showMembers, setShowMembers] = useState(false);
  const [searchedList, setSearchedList] = useState(null);
  const [addedMembers, setAddedMembers] = useState(null);
  const [chatName, setChatName] = useState(chat.name || "");
  const [searchInput, setSearchInput] = useState("");
  const [displayAddMember, setDisplayAddMember] = useState(false);
  const { setSentMessage } = useChat();
  console.log(optionsButtonRefs);
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




  useEffect(() => {
    setChatName(chat.name || "");
    if(addedMembers){
        setAddedMembers(null)
    }
    if(searchInput){
        setSearchInput("")
    }
    if(searchedList) {
        setSearchedList(null)
    }
  }, [chat.name, chat]);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        options &&
        !optionsRef.current.contains(e.target) &&
        optionsButtonRefs.current[options] &&
        !optionsButtonRefs.current[options].contains(e.target)
      ) {
        console.log(optionsButtonRefs);
        console.log("Clicked outside options");
        setOptions(null);
      }
      console.log(e.target);
    };

    if (options !== null) {
      window.addEventListener("click", handleClickOutside);
    }

    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        displayUpdateChatNameForm &&
        !chatNameFormRef.current.contains(e.target) &&
        chatNameFormButtonRef.current &&
        !chatNameFormButtonRef.current.contains(e.target)
      ) {
        console.log(optionsButtonRefs);
        console.log("Clicked outside options");
        setDisplayUpdateChatNameForm(null);
      }
      console.log(e.target);
    };

    if (setDisplayUpdateChatNameForm !== null) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displayUpdateChatNameForm]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        addMemberFormRef.current &&
        !addMemberFormRef.current.contains(e.target) &&
        displayAddMemberButtonRef.current &&
        !displayAddMemberButtonRef.current.contains(e.target)
      ) {
        console.log(optionsButtonRefs);
        console.log("Clicked outside options");
        setDisplayAddMember(false);
      }
      console.log(e.target);
    };

    if (setDisplayAddMember !== null) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [displayAddMember]);

  const handleFileChange = (event) => {
    event.preventDefault();
    console.log("hej");
    if (event.target.files.length > 0) {
      console.log("file inputed");
      updateProfileImage(event.target.files[0]); // Submit the form when a file is selected
    }
  };

  async function updateChatname(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${domainUrl}/api/chats/${chat.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Add your API key to the headers
          },
          body: JSON.stringify({
            name: chatName,
          }),
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      const data = await response.json();
      console.log(data);
      setSentMessage({ true: true });
      setDisplayUpdateChatNameForm(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateProfileImage(file) {
    try {
      console.log("profileImage File", file);
      const formData = new FormData();

      if (file) {
        formData.append("file", file);
        console.log("attahced file", file); // Append the file if it exists
      }
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `${domainUrl}/api/chats/${chat.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: formData,
        }
      );
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      const data = await response.json();
      console.log("update profile data", data);
      setSentMessage({ true: true });
      setDisplayUpdateChatNameForm(false);
    } catch (error) {
      console.log(error);
    }
  }

  function removeMember(member) {
    console.log("remove memebr", member);
    const updatedMembers = addedMembers.filter(
      (addedMember) => addedMember.id !== member.id
    ); // Remove member
    console.log("filtered members", updatedMembers);
    setAddedMembers(updatedMembers);
  }
  async function addMember(member) {
    const existingMember = addedMembers?.some(
      (addedMember) => addedMember.id === member.id
    );

    // Update the addedMembers array based on existence
    const updatedMembers = existingMember
      ? addedMembers // Add member to existing array
      : addedMembers
      ? [...addedMembers, member]
      : [member]; // Create new array with the member

    setAddedMembers(updatedMembers);
    console.log("updatedmemebrs", updatedMembers);

    /* try {
      const response = await fetch(
        `http://localhost:4100/api/chats/${chat.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberIds: members.map((member) => {
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
      console.log(data);
    } catch (error) {
      console.log(error);
    } */
  }

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
      setSearchedList(data.users);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateMembers() {
    try {
    const token = localStorage.getItem("accessToken")
      const response = await fetch(
        `${domainUrl}/api/chats/${chat.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberIds: addedMembers.map((member) => member.id),
            userId: authState.user.id,
          }),
        }
      );
      if(!response.ok){
        const error = await response.json()
        throw error
      }
      const data = await response.json()
      console.log(data)
      setSentMessage({ true: true });
      setDisplayAddMember(false)
    } catch (error) {
        console.log(error)
    }
  }

  return (
    <>
      <div className={styles.editChatContainer}>
        {chat &&
          authState.isAuthenticated &&
          <RenderProfileImage chat={chat} authState={authState} size={100}/>
        }
         { isMobile && <div className={styles.previousButtonContainer2} onClick={()=>setEditChat(false)}><img src="/icons/previous.svg" alt="" /></div>}
        <div className={styles.chatNamesContainer}>
          {chat &&
            authState.isAuthenticated &&
            (chat.name ? (
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
            ))}
        </div>

        <div
          className={styles.changeChatName}
          onClick={() => setDisplayUpdateChatNameForm(true)}
          ref={chatNameFormButtonRef}
        >
          <div>
            <img src="/icons/edit-name.svg" alt="" />{" "}
          </div>
          <p>Change chat name</p>
        </div>

        <label htmlFor="chatProfileImage" className={styles.changeProfileImage}>
          <div>
            <img src="/icons/edit-photo.svg" alt="" />
          </div>{" "}
          <p>Change photo</p>
          <input
            type="file"
            name="file"
            id="chatProfileImage"
            onChange={(e) => handleFileChange(e)}
            className={styles.profileImageFileInput}
          />
        </label>

        <div className={styles.chatMembersContainer}>
          <div
            className={styles.heading}
            onClick={() => setShowMembers(!showMembers)}
          >
            <h3> Chat members </h3>{" "}
            <img
              src={showMembers ? "/icons/down.svg" : "/icons/next.svg"}
              alt=""
            />{" "}
          </div>
          {showMembers && (
            <>
              {chat.members.map((member) => (
                <div className={styles.chatMemberContainer} key={member.id}>
                  <Link className={styles.chatMember} to={"/new/" + member.id}>
                    <img
                      className={styles.profileImage}
                      src={
                        member.profileImage
                          ? domainUrl + "/" + member.profileImage
                          : "/icons/profile.svg"
                      }
                      alt=""
                    />
                    <p>
                      {member.firstname} {member.lastname}
                    </p>
                  </Link>
                  <div
                    className={styles.optionsButtonContainer}
                    onClick={() => setOptions(member.id)}
                  >
                    <img
                      src="/icons/options.svg"
                      alt=""
                      ref={(el) => (optionsButtonRefs.current[member.id] = el)}
                    />
                  </div>
                  {options === member.id && (
                    <div className={styles.optionsContainer} ref={optionsRef}>
                      <div>
                        <Link
                          to={"/new/" + member.id}
                          className={styles.sendMessage}
                        >
                          <img src="/icons/chat.svg" alt="" />
                          <p>Send message</p>
                        </Link>
                      </div>
                      <div>
                        <Link className={styles.showProfile} to={"/users/" + member.id}>
                          <img src="/icons/showProfile.svg" alt="" />
                          <p>Show profile</p>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div
                className={styles.addMember}
                onClick={() => setDisplayAddMember(true) }
                ref={displayAddMemberButtonRef}
              >
                <div className={styles.iconContainer}>
                  <img src="/icons/add-profile.svg" alt="" />
                </div>
                <p>Add members</p>
              </div>
            </>
          )}
          {displayUpdateChatNameForm && (
            <div className={styles.chatNameFormContainer}>
              <form
                action=""
                onSubmit={(e) => updateChatname(e)}
                ref={chatNameFormRef}
              >
                <div className={styles.cancelIconContainer}></div>
                <h3>Change chat name</h3>
                <input
                  type="text"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
                <div className={styles.buttonContainer}>
                  <button
                    type="button"
                    className={styles.cancel}
                    onClick={() => setDisplayUpdateChatNameForm(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className={styles.save}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          )}
          {displayAddMember && (
            <div className={styles.addMemberContainerBackground}>
              <div className={styles.addMemberContainer} ref={addMemberFormRef}>
                <h3>Add members</h3>
                { isMobile && <div className={styles.previousButtonContainer} onClick={()=>setDisplayAddMember(false)}><img src="/icons/previous.svg" alt="" /></div>}
                <div className={styles.inputContainer}>
                  <div className={styles.searchIconContainer}>
                    <img src="/icons/search.svg" alt="" />
                  </div>
                  <input
                    type="search"
                    name="search"
                    id="addMemberSearch"
                    value={searchInput}
                    placeholder="Search"
                    onChange={(e) => searchUser(e)}
                  />
                </div>
                <div className={styles.addedMembersContainer}>
                  {addedMembers && addedMembers?.length > 0 ? (
                    <>
                      {addedMembers.map((member) => (
                        <div
                          className={styles.addedMemberContainer}
                          key={member.id}
                        >
                          <div className={styles.imageContainer}>
                            <img
                              src={
                                domainUrl +"/" + member.profileImage
                              }
                              alt=""
                              className={styles.profileImage}
                            />

                            <img
                              src="/icons/cancel.svg"
                              alt=""
                              className={styles.cancelIcon}
                              onClick={() => removeMember(member)}
                            />
                          </div>
                          <p>
                            {member.firstname} {member.lastname}
                          </p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className={styles.noAddedMemberContainer}>
                      <p>No members added</p>
                    </div>
                  )}
                </div>
                <div className={styles.searchContainer}>
                  {searchedList &&
                    searchedList.length > 0 &&
                    searchedList.map((searchedUser) => (
                      <div
                        className={styles.searchedUserContainer}
                        key={searchedUser.id}
                        onClick={() => addMember(searchedUser)}
                      >
                        <div className={styles.searchedUserProfile}>
                          <img
                            src={
                              domainUrl +
                              searchedUser.profileImage
                            }
                            alt=""
                          />
                          <p>
                            {searchedUser.firstname} {searchedUser.lastname}
                          </p>
                        </div>
                        <div className={styles.selectIcon}>
                          {addedMembers &&
                          addedMembers.some(
                            (member) => member.id === searchedUser.id
                          ) ? (
                            <img src="/icons/checked.svg" alt="" />
                          ) : (
                            <img src="/icons/select.svg" alt="" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                <button
                  className={
                    addedMembers && addedMembers.length > 0
                      ? styles.addMembersButton
                      : styles.disableAddMembersButton
                  }
                  onClick={updateMembers}
                >
                  Add members
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EditChat;
