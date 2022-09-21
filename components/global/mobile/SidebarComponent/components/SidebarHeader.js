import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";  
import { BsGear } from "react-icons/bs";
import { getFullname, getToken } from "../../../../../layout/utils";
import Greeting from "../../../../common/Greeting"; 

export default function SidebarHeader() {

  const router = useRouter()
 
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userDetails, setUserDetails] = useState({})

  useEffect(() => {
    const stoken = getToken()   
    if (stoken && stoken !==null ) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }

    const user = sessionStorage.getItem('customer');
    if (user && user !== undefined && user !== null) {
      const  userJson = JSON.parse(user);
      setUserDetails(userJson)
    }
  }, [])

  // const logout = () => {
  //   sessionStorage.clear()
  //   localStorage.clear()
  //   router.push('/sign-in')
  // }   

  const handleSettingClick = () => {
    router.push('/profile-details')
  }
  
  return (
    <div className='sidebarHeader'>
      <div 
        className={isLoggedIn ? "greeting-ui" : "p-0 greeting-ui"}
        >
        {isLoggedIn && <div className="profile-image"><span></span></div>}
        <p className="greeting-text"><Greeting /><br />{getFullname(userDetails)}</p>
        <p className="user-profile"><small>{userDetails?.email}</small></p>

        {isLoggedIn && <span onClick={() => handleSettingClick()} className="gearicon"><BsGear /></span>}
      </div>

      {!isLoggedIn && <Link className="header-signin" href="/sign-in"><button type="button">Sign in</button></Link>}
     
    </div>
  );
}
