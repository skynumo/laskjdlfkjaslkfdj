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

export default function RelatedProducts(props) {
  
  const appData = useContext(AppContext)

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  const customertoken = appData.token;
  const countryCode = appData.countryCode;

  const categoryId = props.catId ? props.catId : '73';

  const [youMayLikeData, setRelatedProductsData] = useState([]);

  const fetchRelatedProducts = async (categoryId) => {

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
        setRelatedProductsData(data.data);
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
        fetchRelatedProducts(categoryId);
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
        fetchRelatedProducts(categoryId);
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
    fetchRelatedProducts(categoryId);
  }, [categoryId])

  let slidesPerView

  return (
    <React.Fragment>
      {youMayLikeData.length > 0 &&
        <div className='relatedProductCard'>
          <h2>Similar Products</h2>
          <Swiper
            slidesPerView={2.2}
            spaceBetween={5}
            freeMode={true}
            modules={[FreeMode]}
            breakpoints={{
              300: {
                width: 300,
                slidesPerView: 2.2,
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
                <div className='imageContainer'>
                  <Image src={item.productimageurl ? item.productimageurl : "/sample.png"} alt={item.productname} width={154} height={232} />
                  {!item.wishlist && <AiOutlineHeart onClick={() => handleAddToWishlist(item)} />}
                  {item.wishlist && <span><AiFillHeart onClick={() => handleRemoveFromWishlist(item)} /></span>}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      }
    </React.Fragment>
  );
}
