import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";

export default function SliderBanner() {
  return (
    <div className={styles.sliderBanner}>
      <Swiper slidesPerView={1} spaceBetween={10} freeMode={true} modules={[FreeMode]}>
        {Array(5)
          .fill(5)
          .map((sliderImage) => (
            <SwiperSlide key={sliderImage}>
              <Image src="/banner3.png" alt="sample" width={400} height={200} />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
