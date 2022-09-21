import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";
import React from "react";
import Link from "next/link";

export default function NewArrivals(props) {

  const data = props.data ? props.data : [];

  return (
    <React.Fragment>
      {data.length > 0 &&
        <div className={styles.newArrivals}>
          <h2>New Arrivals</h2>
          <Swiper slidesPerView={4.5} spaceBetween={10} freeMode={true} modules={[FreeMode]}>
            {data.map((item) => {
              const hasProduct = item.products.length > 0 ? true : false;
              if (hasProduct) {
                return <SwiperSlide key={item.id}>
                  <div className="new-arrivals">
                    <Link href={{pathname: '/products', query:{pCatId: item.id}}}><Image src={item.products['0'].image ? item.products['0'].image : "/newArrival_sample.jpg"} alt="" width={100} height={100} /></Link>
                    <span className='na-name'>{item.name}</span>
                  </div>
                </SwiperSlide>
              }
            }
            )}
          </Swiper>
        </div>
      }
    </React.Fragment>
  );
}
