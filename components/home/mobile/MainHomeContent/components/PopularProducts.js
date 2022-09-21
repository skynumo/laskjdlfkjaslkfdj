import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FreeMode } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import styles from "../MainHomeContent.module.css";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { AppContext } from "../../../../../pages/_app";
import { getCountryCode, getToken } from "../../../../../layout/utils";

export default function PopularProducts(props) {

  const appData = useContext(AppContext)

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  const countryCode = appData.countryCode;

  const categoryId = props.catId ? props.catId : '73';

  const [youMayLikeData, setYouMayLikeData] = useState([]);

  const fetchYouMayLike = async (categoryId) => {

    const customertoken = getToken();
    const customerid = sessionStorage.getItem('customer_id');
    const countryCode = getCountryCode();

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/newarrival`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "storecode": countryCode,
            "customerid": customerid,
            "categoryid": categoryId 
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }          
      })
      const data = await res.json();
      if (data.success === 200) {
        setYouMayLikeData(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addToWishlist = async (productid) => {

    const customertoken = getToken();
    const countryCode = getCountryCode();

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/addwishlist`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "customerid": appData.customerid,
            "productid": productid
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }          
      })
      const data = await res.json();
      if (data.success === 200) {
        fetchYouMayLike(categoryId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeFromWishlist = async (productid) => {

    const customertoken = getToken();
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
          'Authorization': `Bearer ${customertoken}`,
        }          
      })
      const data = await res.json();
      if (data.success === 200) {
        fetchYouMayLike(categoryId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddToWishlist = (product) => {
    addToWishlist(product.productid)
  }

  const handleRemoveFromWishlist = (product) => {
    removeFromWishlist(product.productid)
  }

  useEffect(() => {
    fetchYouMayLike(categoryId);
  }, [categoryId])
 
  return (
    <div className="popular-product-ui">
      {youMayLikeData.length > 0 &&
        <div className={styles.youMayLike}>
          <h2 className="popular-pheading">Popular On Newness <span className="text-primary"><Link href="/products">Show All</Link></span></h2>
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
            {youMayLikeData.map((item) => (
              <SwiperSlide key={item.productid}>
                <div className={styles.imageContainer}>
                  <Link href={`/product/${item.productsku}`}>
                    <Image src={item.productimageurl ? item.productimageurl : "/sample.png" } alt={item.productname} width={154} height={232} />
                  </Link>
                  {!item.wishlist && <AiOutlineHeart onClick={() => handleAddToWishlist(item)} />}
                  {item.wishlist && <span><AiFillHeart onClick={() => handleRemoveFromWishlist(item)} /></span>}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </div>
  );
}
