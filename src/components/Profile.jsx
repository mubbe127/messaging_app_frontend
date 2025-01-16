import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";
import { useAuth } from "../utils/useAuth";
import domainUrl from "../utils/domain";

function Profile() {
  const { userId } = useParams();
  const token = localStorage.getItem("accessToken");
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const { authState } = useAuth();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Navigates to the previous page
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${domainUrl}/api/users/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
     // Handle or set state with fetched data
      setProfile(data);
      setUsername(data.username);
      setFirstname(data.firstname);
      setLastname(data.lastname);
      setEmail(data.email);
      setFile(data.profileImage);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, token]);

  async function updateProfile() {
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();
      formData.append("username", username);
      formData.append("lastname", lastname);
      formData.append("firstname", firstname);
      formData.append("email", email);
  

      if (file) {
        formData.append("file", file); // Append the file if it exists
      }
     
      const response = await fetch(
        `${domainUrl}/api/users/${userId}`,
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
      
      setEditProfile(false);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {!editProfile && (
        <div className={styles.profileContainer}>
          {profile && (
            <div className={styles.profileImage}>
              <div>
                <img
                  src={
                    profile.profileImage
                      ? domainUrl + "/"+ profile.profileImage
                      : "/icons/profile.svg"
                  }
                  alt=""
                />
              </div>
            </div>
          )}
          {profile && (
            <div>
              <p>{profile.username}</p>{" "}
            </div>
          )}
          {profile && (
            <div className={styles.name}>
              <p>
                {profile.firstname} {profile.lastname}
              </p>
            </div>
          )}
          {profile && (
            <div className={styles.email}>
              <p>{profile.email}</p>
            </div>
          )}
          {authState && authState.user?.id === Number(userId) && (
            <div className={styles.editButton}>
              <button onClick={() => setEditProfile(true)}>Edit profile</button>
            </div>
          )}
          <div className={styles.previousButtonContainer}>
            <img src="/icons/previous.svg" alt="" onClick={goBack} />
          </div>
          <div>
            <Link to={"/new/" + userId}>Send Message</Link>
          </div>
        </div>
      )}
      {editProfile && (
        <div className={styles.editProfile}>
          {profile && (
            <div className={styles.profileImage}>
              <div>
                <img
                  src={
                    profile.profileImage
                      ? domainUrl + "/" + profile.profileImage
                      : "/icons/profile.svg"
                  }
                  alt=""
                />
              </div>
            </div>
          )}
          <div className={styles.fileContainer}>
            <input
              type="file"
              name="profileImage"
              id="profileImage"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <div className={styles.nameInputContainer}>
            <input
              type="text"
              name="firstname"
              id="firstname"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Firstname"
            />
            <input
              type="text"
              name="lastname"
              id="lastname"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Lastname"
            />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Lastname"
          />
          <div className={styles.buttonContainer}>
            <button
              onClick={() => setEditProfile(false)}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button onClick={updateProfile} className={styles.saveButton}>
              Save
            </button>
          </div>

        </div>
        
      )}
    </>
  );
}

export default Profile;
