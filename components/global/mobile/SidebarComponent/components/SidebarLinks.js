import NavigationLink from "./NavigationLink";
import { BsTruck, BsWallet, BsBag, BsGift, BsCash, BsInfoCircle } from "react-icons/bs";
import styles from "../SidebarComponent.module.css";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../../../pages/_app";

export default function SidebarLinks() {

  const appData = useContext(AppContext)
  const [ordercount, setOrderCount] = useState(0);

  useEffect(() => {
    const orderCount = sessionStorage.getItem('orderCount')
    if (orderCount && orderCount !== null && orderCount !== undefined) {
      setOrderCount(orderCount)
    }
  }, [])


  return (
    <div className='sidebarLinks'>
      <NavigationLink icon={<BsTruck />} title="My Orders" link="/myorders" count={ordercount} />
      <NavigationLink icon={<BsGift />} title="My Addresses" link="/my-addresses" />
      <NavigationLink icon={<BsWallet />} title="My Cards" link="/my-cards" />
      {/* <NavigationLink icon={<BsCash />} title="My Credit" link="/my-credit" /> */}
      <div className='sidebar-nav-link' onClick={() => appData.openComingSoonModal()} >
        {<BsCash />}
        <span className="link">My Credit</span> 
      </div>
      <NavigationLink icon={<BsBag />} title="My Returns" link="/my-returns" />
      <NavigationLink icon={<BsInfoCircle />} title="FAQ & Contact Us" link="/faq-and-contact" />
    </div>
  );
}
