import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import { getTokenType } from "../../layout/utils";
import styles from "../../styles/CartContent.module.css";

export default function EmptyWishlistBox() {

  const [activeButton, setActiveButton] = useState('login');

  useEffect(() => {
    const ttype =  getTokenType()
    if (ttype === 'login') {
      setActiveButton('product')
    } else {
      setActiveButton('login')
    }
  }, [])

  return (
    <div className={styles.cartBox}>
      <div className={styles.cardContainer}>
      <div className='empty-icon-box'>
          <Image src="/wishlist-icon.svg" alt="" width={70} height={56} />
        </div>
      </div>
      <div className={styles.cartText}>
        <h2>Favourite List is Empty</h2>
        <p>Add your favourite product here<br />and buy them later.</p>
      </div>
      <div className={styles.cardContainer}>
        { activeButton === 'login' ? 
          <Link href="/sign-in"><button className="btn btn-primary btn-lg">Login</button></Link>
          :
          <Link href="/home"><button className="btn btn-primary btn-lg">View Products</button></Link>
        }
      </div>
    </div>
  );
}
