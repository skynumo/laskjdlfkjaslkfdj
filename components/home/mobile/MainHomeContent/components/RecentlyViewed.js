import Image from "next/image";
import Link from "next/link";
import React from "react";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";

export default function RecentlyViewed(props) {
  const data = props.data ? props.data.items : [];
  const activeCategoryId = props.activeCategoryId ? props.activeCategoryId : '73';

  return (
    <React.Fragment>
      {data.length > 0 && (
        <div className={styles.recentlyViewed}>
          <h2>Recently Viewed</h2>
          <div className={styles.cardContainer}>
            {data.slice(0, 3).map((item) => (
              <div className={styles.card} key={item.id}>
                <div className="rv-image">
                  <Link href={`/product/${item.sku}`}>
                    <Image
                      src={item.extension_attributes.prod_image_url ? item.extension_attributes.prod_image_url : "/newArrival_sample.jpg"}
                      alt=""
                      width={75}
                      height={75}
                    />
                  </Link>
                </div>
                <Link href={`/product/${item.sku}`}>
                  <div className={styles.recentlyViewedTextBox}>
                    <h3>{item.name ? item.name : "Xerjoff Shooting"}</h3>
                    <p className="mb-0">
                      {item.extension_attributes.product_discount_price
                        ? item.extension_attributes.product_discount_price
                        : ""}{" "}
                      <s>{item.price ? item.price : ""}</s>
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href={{pathname: '/products', query:{pCatId: activeCategoryId}}}>
              <button className="button">View All</button>
            </Link>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
