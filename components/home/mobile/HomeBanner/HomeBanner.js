// import Image from "next/image";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "./Header.module.css";
import Link from 'next/link'

export default function HomeBanner(props) {

  const data = props.data ? props.data : []
 
  return (
    <div className={styles.header}>
      {/* <Image src="/banner.jpg" alt="banner" layout="fill" /> */}
      <div className={styles.sliderBanner}>
        <Swiper slidesPerView={1} loop={true}autoplay={{delay: 2500,disableOnInteraction: false,}} spaceBetween={0} freeMode={true} modules={[FreeMode, Autoplay]}>
          {data.map((slider, idx) => (
              <SwiperSlide key={idx}>
                {slider && <Image src={slider} alt="" width={500} height={280} />}
                {/* <Link href="/shop" className={styles.button}>{slider}</Link> */}
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
