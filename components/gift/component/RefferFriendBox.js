import Image from "next/image";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../GiftContent.module.css";

export default function RefferFriend() {
  return (
    <div className={styles.refferFriend}>
      <h2>Rewards</h2>
      <div className={styles.cardContainer}>
          <div className={styles.card} style={{background:" #212E4F"}}>
            <div className={styles.imageDiv}>
              <img src="/gift.svg" alt="sample" width={40} height={40} />
            </div>
            <div>
              <p>
                Refer & Earn with us
              </p>
            </div>
            <div>
              <button>Refer a friend</button>
            </div>
          </div>

          <div className={styles.card} style={{background:" #FF543E"}}>
            <div className={styles.imageDiv}>
              <img src="/instagram.svg" alt="sample" width={40} height={40} />
            </div>
            <div>
              <p>
                Follow @Newness on instagram
              </p>
            </div>
          </div>

          <div className={styles.card} style={{background:" #4360FF"}}>
            <div className={styles.imageDiv}>
              <img src="/facebook.svg" alt="sample" width={40} height={40} />
            </div>
            <div>
              <p>
                Follow @Newness on facebook
              </p>
            </div>
          </div>
      </div>
      <div className={styles.banner}>
        <h2>Something exciting to watch out for...</h2>
        <img src="/banner4.png" alt="" width={370} height={208}  />
      </div>
    </div>
  );
}
