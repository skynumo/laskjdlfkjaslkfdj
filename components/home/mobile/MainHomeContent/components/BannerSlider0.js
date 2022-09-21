import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";
import React from "react";

export default function SliderBanner0(props) {

  const data = props.data ? props.data['0'].slides['0'] : {};

  return (
    <React.Fragment>
      {data &&
        <div className={styles.sliderBanner}>
          {data.image && <Image src={data.image} alt="" width={400} height={200} />}

          {/* <Swiper slidesPerView={1} spaceBetween={10} freeMode={true} modules={[FreeMode]}>
          {data.map((item) => (
              <SwiperSlide key={item.category_id}>
                <Image src={item.image} alt={item.name} width={400} height={200} />
              </SwiperSlide>
            ))}
        </Swiper> */}
        </div>
      }
    </React.Fragment>
  );
}
