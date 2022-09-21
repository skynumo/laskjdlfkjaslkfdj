// import { useState } from "react";
// import Categories from "../home/mobile/MainHomeContent/components/Categories";
import styles from "./GiftContent.module.css";
import RefferFriend from "./component/RefferFriendBox";
import SliderBanner1 from "../home/mobile/MainHomeContent/components/BannerSlider2";

// const categories = ["Women", "Men", "Kids", "Electronics"];

export default function GiftContent() {
//   const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className={styles.giftContent}>        
      <RefferFriend />
    </div>
  );
}
