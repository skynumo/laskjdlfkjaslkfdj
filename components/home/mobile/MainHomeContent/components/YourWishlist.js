import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";
import React, { useState, useEffect, useContext } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import Link from "next/link";
import { AppContext } from "../../../../../pages/_app";
import { getCountryCode, getToken } from "../../../../../layout/utils";

export default function YourWishlist(props) {

  const appData = useContext(AppContext)

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
 
  const data = props.data ? props.data.items : [];
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {

    const token = getToken();
    const countryCode = getCountryCode();

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/getwishlist`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "storecode": countryCode,
            "customerid": appData.customerid,
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const data = await res.json();
      setWishlist(data.result);
    } catch (err) {
      console.log("Banner API Error", err);
    }
  };

  const removeFromWishlist = async (productid) => {

    const token = getToken();
    const countryCode = getCountryCode();

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/deletewishlist`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "customerid": appData.customerid,
            "productid": productid
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const data = await res.json();
      if (data.success === 200) {
        fetchWishlist();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product.id)
  }

  useEffect(() => {
    fetchWishlist();
  }, [])

  return (
    <React.Fragment>
      {wishlist && wishlist.length > 0 &&
        <div className={styles.wishlistProducts}>
          <div className={styles.wishlistProductsHeader}>
            <h2 className="text-center">Your Wishlist</h2>
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
            {wishlist.map((item) => (
              <SwiperSlide key={item.id}>
                <div className={styles.card}>
                  <Link href={`/product/${item.sku}`}>
                    <Image src={item.imageurl} alt="" width={150} height={150} />
                  </Link>
                  <span><AiFillHeart onClick={() => handleRemoveFromWishlist(item)} /></span>
                  <Link href={`/product/${item.sku}`}>
                    <div className={styles.wishlistProductsBody}>
                      <h3>{item?.name}</h3>
                      <p>
                        {item.discount_price} <s>{item.price}</s>
                      </p>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </React.Fragment>

  );
}
