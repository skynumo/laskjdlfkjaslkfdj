import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";
import React from "react";
import Link from "next/link";

export default function TrendingProducts(props) {

  const data = props.data ? props.data.items : [];

  return (
    <React.Fragment>
      {data.length > 0 &&
        <div className={styles.trendingProducts}>
          <div className={styles.trendingProductsHeader}>
            <h2>Trending Products</h2>
            <Link href={`/products/`}>
              <button>View All</button>
            </Link>
          </div>
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
                  <Link href={`/product/${item.sku}`}>
                    <Image src={item.extension_attributes.prod_image_url} alt="" width={150} height={150} />
                  </Link>
                  <h3>{item?.name}</h3>
                  <p>
                    {item.extension_attributes.product_discount_price} <s>{item.extension_attributes.price}</s>
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </React.Fragment>

  );
}
