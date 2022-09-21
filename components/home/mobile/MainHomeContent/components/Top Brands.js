import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";
import React from "react";
import Link from "next/link";

export default function TopBrands(props) {

  const data = props.data ? props.data : []

  return (
    <React.Fragment>
      {data.length > 0 &&
        <div className='topBrands'>
          <h2>Top Brands</h2>
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
                <Link href={{pathname: '/products', query:{pBrandId: item.id}}}>
                  <Image src={item.small_image ? item.small_image : "/brands.png"} alt={item.brand_name} width={100} height={100} />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </React.Fragment>
  );
}
