import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";
import React from "react";
import Link from "next/link";

export default function TopOffersOnBrands(props) {

  const data = props.data ? props.data : [];
 
  return (
    <React.Fragment>
      {data.length > 0 &&
        <div className={styles.topOffersOnBrands}>
          <h2>Top Offers On Brands</h2>
          <Swiper
            slidesPerView={2.3}
            spaceBetween={5}
            freeMode={true}
            modules={[FreeMode]}
            breakpoints={{
              300: {
                width: 300,
                slidesPerView: 2.3,
              },
              640: {
                width: 640,
                slidesPerView: 4,
              },
              768: {
                width: 768,
                slidesPerView: 5,
              },
            }}
          >
            {data.map((item) => (
              <SwiperSlide key={item.id}>
                <div className={styles.card}>
                  <Link href={{pathname: '/products', query:{pBrandId: item.id}}}>
                    <Image src={item.small_image ? item.small_image : "/newArrival_sample.jpg"} alt={item.brand_name} width={150} height={150} />
                  </Link>
                  <h3>{item.brand_name}</h3>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </React.Fragment>

  );
}
