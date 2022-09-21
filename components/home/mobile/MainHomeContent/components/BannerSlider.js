import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";

export default function SliderBanner(props) {

  const data = props.data ? props.data : []

  return (
    <div className={styles.sliderBanner}>
      <Swiper slidesPerView={1.2} spaceBetween={10} freeMode={true} modules={[FreeMode]}>
        {data.map((item, idx) => (
            <SwiperSlide key={Math.random()}>
              <Image src={item.banner_image ? item.banner_image['0'] : "/banner3.png"} alt="" width={400} height={150} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
