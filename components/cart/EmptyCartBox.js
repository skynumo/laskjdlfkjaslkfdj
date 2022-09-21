import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../../styles/CartContent.module.css";

export default function EmptyCartBox() {
  return (
    <div className={styles.cartBox}>
      <div className={styles.cardContainer}>
        <div className='empty-icon-box'>
          <Image src="/cart-icon.svg" alt="sample" width={62} height={74} />
        </div>
      </div>
      <div className={styles.cartText}>
        <h2>Cart is Empty</h2>
        <p>There is nothing in your bag.<br></br>Lets add some items</p>
      </div>
      <div className={styles.cardContainer}>
        <Link href="/home"><button>Continue Shopping</button></Link>
      </div>
    </div>
  );
}
