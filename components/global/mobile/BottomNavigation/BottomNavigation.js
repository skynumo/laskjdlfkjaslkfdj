import { useContext, useState, useEffect } from "react";
import Link from 'next/link';
import {
  AiOutlineHome,
  AiOutlineGift,
  AiOutlineAppstore,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import styles from "./BottomNavigation.module.css";

export default function BottomNavigation() {
  const [activeLink, setActiveLink] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    const cartcount = localStorage.getItem('cartCount');
    setCartCount(cartcount);
  }, [])
  

  return (
    <div className={styles.bottomNavigation}>
      {links.map((link, index) => (
        <Link key={index} href={link.url}>
          <div
            key={index}
            className={`${styles.link} ${activeLink === index ? styles.active : null}`}
            onClick={() => setActiveLink(index)}
          >
              {link.icon}
              {activeLink === index && <p>{link.text}</p>}
              {cartCount > 0 && activeLink !== index && link.text === "Cart" && <span className='badge footer-badge badge-primary bg-primary text-white position-absolute'>{cartCount}</span>}
          </div>
          </Link>
      ))}
    </div>
  );
}

const links = [
  {
    icon: <AiOutlineHome />,
    text: "Home",
    url:"/home"
  },
  {
    icon: <AiOutlineGift />,
    text: "Gift",
    url:"/gift"
  },
  {
    icon: <AiOutlineAppstore />,
    text: "Categories",
    url:"/categories"
  },
  {
    icon: <AiOutlineHeart />,
    text: "Wishlist",
    url:"/wishlist"
  },
  {
    icon: <AiOutlineShoppingCart />,
    text: "Cart",
    url:"/cart"
  },
];
