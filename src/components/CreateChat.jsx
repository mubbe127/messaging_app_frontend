import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../utils/useAuth";

import styles from "./CreateChat.module.css";

function CreateChat() {
  const {authState}= useAuth()  
  const [searchedUsers, setSearchedUsers] = useState([]);

  async function searchUser(e) {
    const token = localStorage.getItem("accessToken");
    const response = await fetch(`http://localhost:4100/users/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: e.target.value,
      }),
    });
    if (!response.ok) {
      const error = response.json();
      throw error;
    }
    const data = await response.json();
    setSearchedUsers(data.users);
  }

  async function addMember(member){
    const token = localStorage.getItem('accessToken')
   const response = await fetch(`http//localhost:4100/api/chats`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            member,
            creator: authState.user.id
        })
    })
    if(!response.ok){
        const error= await response.json()
        throw error
    }
    const data = await response.json()
    if(data.foundChat){

        

    }

    fetch(`http://localhost:4100/api/chat`)
  }

  return (
    <div className={styles.createChatContainer}>
      <div className={styles.searchContainer}>
        <form action="">
          <input type="search" name="search" id="search" onChange={(e)=>searchUser(e)}/>
        </form>
      </div>
      <div className={styles.searchedUsersContainer}>
        {searchedUsers && searchedUsers.map( searchedUser => 
            (<div className={styles.searchedUserContainer} key={searchedUser.id} onClick={()=>addMember(searchedUser.id)}>
                <img src="" alt="" />
                <p>{searchedUser.firstname} {searchedUser.lastname}</p>
            </div>)
        )}
      </div>
    </div>
  );
}
