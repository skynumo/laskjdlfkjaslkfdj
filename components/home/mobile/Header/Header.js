// import Image from "next/image";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <div className={styles.header}>
      {/* <Image src="/banner.jpg" alt="banner" layout="fill" /> */}
      <div className={styles.sliderBanner}>
        <Swiper slidesPerView={1} loop={true}autoplay={{delay: 2500,disableOnInteraction: false,}} spaceBetween={0} freeMode={true} modules={[FreeMode, Autoplay]}>
          {Array(5)
            .fill(5)
            .map((sliderImage) => (
              <SwiperSlide key={sliderImage}>
                <Image src="/banner.png" alt="" width={500} height={280} />
                <button className={styles.button}>Shop Now</button>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
      {/* <div className={styles.container}>
        <button className={styles.button}>Shop Now</button>
      </div> */}
    </div>
  );
}
