import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getCountryCode, getQuoteId, getToken, getTokenType } from "../../layout/utils"; 
import { Loader } from "../common/Loader";
import { Modal } from "../common/modal";
import PopularProducts from "../home/mobile/MainHomeContent/components/PopularProducts";
import EmptyCartBox from "./EmptyCartBox"; 

export default function CartContent() {

  const router = useRouter();
 
  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  const imgUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const [cartData, setCartData] = useState([])
  const [loadingDone, setLoadingDone] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState({})
  const [checkoutLoader, setCheckoutLoader] = useState(false)

  const fetchCartData = async () => {

    const token = getToken();
    const countryCode = getCountryCode();

    let url = `${APIUrl}/${countryCode}/V1/carts/mine/totals`;

    const tokenType = getTokenType()
    if (tokenType === 'guest') {
      url = `${APIUrl}/${countryCode}/V1/guest-carts/${token}/totals`;
    } 

    setLoadingDone(true);
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json();
      setCartData(data);
      setDeleteConfirm(false)
      setLoadingDone(false);
    } catch (err) {
      console.log(err);
      setLoadingDone(false);
    }
  };

  const putCartItems = async (qty, itemId) => {
    const quote_id = getQuoteId();
    const token = getToken();
    const countryCode = getCountryCode();

    let url = `${APIUrl}/${countryCode}/V1/carts/mine/items/${itemId}`;

    const tokenType = getTokenType()
    if (tokenType === 'guest') {
      url = `${APIUrl}/${countryCode}/V1/guest-carts/${token}/items/${itemId}`;
    } 

    try {
      const res = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
          "cartItem": {
            "quote_id": quote_id,
            "qty": qty,
            "item_id": itemId
          }
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      if (res.status === 400) {
        const data = await res.json();
        console.log("Put Res", data.message)
      }
      fetchCartData();

    } catch (err) {
      console.log(err);
    }
  };

  const deleteCartItem = async (itemId) => {

    const token = getToken();
    const countryCode = getCountryCode();

    let url = `${APIUrl}/${countryCode}/V1/carts/mine/items/${itemId}`;

    const tokenType = getTokenType()
    if (tokenType === 'guest') {
      url = `${APIUrl}/${countryCode}/V1/guest-carts/${token}/items/${itemId}`;
    } 

    try {
      const res = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      const data = await res.json();
      if (data === true) {
        fetchCartData()
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCartData()
  }, [])

  const handleIncrementCount = (index, item) => {

    let newItems = [...cartData.items]
    newItems[index].qty = parseInt(item.qty) + 1
    newItems[index].row_total = (newItems[index].price * newItems[index].qty);
    setCartData({ ...cartData, items: newItems })

    const newQty = parseInt(item.qty) + 1;
    putCartItems(newQty, item.item_id, index)
  }

  const handleDecrementCount = (index, item) => {
    if (item.qty > 1) {

      let newItems = [...cartData.items]
      newItems[index].qty = parseInt(item.qty) - 1;
      newItems[index].row_total = (newItems[index].price * newItems[index].qty);
      setCartData({ ...cartData, items: newItems })

      const newQty = parseInt(item.qty) - 1;
      putCartItems(newQty, item.item_id, index)
    }
  }

  const removeProduct = (product) => {
    setDeleteConfirm(true)
    setSelectedProduct(product);
  }

  const confirmRemoveProduct = () => {
    deleteCartItem(selectedProduct.item_id)
  }

  const cancelRemoveProduct = () => {
    setDeleteConfirm(false)
  }

  const handleCheckoutClick = () => {
    setCheckoutLoader(true);
   
    const tokenType = getTokenType()
    if (tokenType !== 'login') {
      router.push('/checkout-sign-in')
    } else {
      router.push('/checkout')
    }
  
    setTimeout(() => {
      setCheckoutLoader(false)
    }, 5000);
  }

  return (
    <div className='cart-page-ui'>
      <div className="cart-header">Cart</div>
      {cartData.items_qty === 0 && !loadingDone ?
        <>
          <EmptyCartBox />
          <PopularProducts />
        </>
        :
        <div className="cart-full-details">
          <div className="cart-listing text-muted">
            {cartData.items && cartData.items.map((item, idx) =>
              <div key={item.item_id} className="card">
                <div className="card-body">
                  <span onClick={() => removeProduct(item)} className="close text-muted">&times;</span>
                  <div className="cl-image">
                    {/* <Link href={`/product/`}> */}
                    <Image src={`${imgUrl}${item.extension_attributes.product_image}`} width={100} height={100} alt="" />
                    {/* </Link> */}
                  </div>
                  <div className="clc-box">
                    <div className="card-title">{item.name}</div>
                    <div className="card-pricebox">
                      <span className="text-primary">{item.row_total}</span>
                      <span className="cl-qty">
                        <span onClick={() => handleIncrementCount(idx, item)} className="cl-plus">+</span>
                        <span className="form-control d-inline-block" >{item.qty}</span>
                        <span onClick={() => handleDecrementCount(idx, item)} className="cl-minus">-</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="cart-totals">
            <div className="cart-tprice">
              <span className="ctprice">{cartData.grand_total}</span>
              <span>Total</span>
            </div>
            <div className="carttbtn">
              <button onClick={() => handleCheckoutClick()} className="btn btn-outline-light btn-lg">
                Check Out {checkoutLoader && <Loader type="inline" />}
              </button>
            </div>
          </div>
        </div>
      }

      {deleteConfirm &&
        <Modal
          title="Newness"
          content="Are you sure you want to remove this product?"
          onClose={() => cancelRemoveProduct()}
          onConfirm={() => confirmRemoveProduct()}
        />
      }
    </div>

  );
}
