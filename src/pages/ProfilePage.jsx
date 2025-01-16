import Profile from "../components/Profile";

import Logout from "../components/Logout";
import { useAuth } from "../utils/useAuth";


function ProfilePage() {
  const {authState} = useAuth()
  const token = localStorage.getItem('refreshToken')
  const isMobile = window.innerWidth <= 768;
  return (
    <>
  {!isMobile && <Logout/> }
  <Profile/>
  </>
);
}

export default ProfilePage
