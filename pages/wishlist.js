import Image from "next/image";
import styles from "../components/home/mobile/MainHomeContent/MainHomeContent.module.css";
import React, { useState,useContext, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import PopularProducts from "../components/home/mobile/MainHomeContent/components/PopularProducts";
import EmptyWishlistBox from "../components/wishlist/EmptyWishlistBox";
import Link from "next/link";
import { AppContext } from "./_app";
import { getCountryCode, getToken } from "../layout/utils";

export default function Wishlist() {

  const appData = useContext(AppContext)

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
 
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    
    const customertoken = getToken();
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
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const data = await res.json();
      if (data.status === 200) {
        console.log("Wishlist: ", data.result);
        setWishlist(data.result ?? data.data);
      }
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
    <div className="wishlist-page-ui">
    <div className="wl-header">Favourites</div>
     
      {wishlist && wishlist.length === 0 &&
        <>
        <EmptyWishlistBox /> 
        <PopularProducts />
        </>
      }

      {wishlist && wishlist.length > 0 &&
        <div className={styles.wishlistProducts}>
          <div className="row g-2">
            {wishlist.map((item) => (
              <div key={item.id} className="col-6 col-sm-6 col-md-4 mb-2">
                <div className={styles.card}>
                  <Link href={`/product/${item.sku}`}>
                    <Image src={item.imageurl} alt="" width={150} height={150} />
                  </Link>
                  <span><AiFillHeart onClick={() => handleRemoveFromWishlist(item)} /></span>
                  <div className={styles.wishlistProductsBody}>
                    <Link href={`/product/${item.sku}`}>
                      <div className="wl-data text-muted">
                        <h3 className="wl-name">{item?.name}</h3>
                        <p className="wl-type text-muted">{item?.type}</p>
                        <p className="wl-price">
                          {item.discount_price} <s>{item.price}</s>
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
}