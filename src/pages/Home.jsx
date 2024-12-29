import Logout from "../components/Logout";
import { useAuth } from "../utils/useAuth";


function Home() {
  const {authState} = useAuth()
  const token = localStorage.getItem('refreshToken')

  return (
    <>
  <Logout/>
  <div>Home</div>
  </>
);
}

export default Home;
