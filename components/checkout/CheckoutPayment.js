import Image from "next/image";
import React, { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCheckCircle, FaCreditCard } from "react-icons/fa";
import {
  getCardLastNumber,
  getFullname,
  getStreetText,
  getToken,
} from "../../layout/utils";
import { AppContext } from "../../pages/_app";
import AddCardScreen from "./AddCardScreen";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { useRouter } from "next/router";

const CheckoutPayment = () => {
  const APIUrl = process.env.NEXT_PUBLIC_API_URL;
  const countryCode = appData?.countryCode;
  const imgUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  const router = useRouter()
  const appData = useContext(AppContext);

  const paymentMethods = appData?.shippingInformation?.payment_methods;
  const totals = appData?.shippingInformation?.totals;

  const [showCouponForm, setShowCouponForm] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [selectedMethod, setSelectedMethods] = useState({});
  const [showAddCardScreen, setShowAddCardScreen] = useState(false);
  const [cardsList, setCardsList] = useState([]);
  const [selectedCard, setSelectedCard] = useState(
    cardsList.length > 0 ? cardsList["0"] : {}
  );

  const fetchCards = async () => {

    const customertoken = getToken();
    
    try {
      const res = await fetch(
        `${APIUrl}/${countryCode.toLowerCase()}/V1/customer/get-cards`,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              token: customertoken,
              customer_id: appData.customerid,
            },
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customertoken}`,
          },
        }
      );
      const resData = await res.json();
      if (resData.success === 200) {
        if (resData.data.totalRecords > 0) {
          setCardsList(resData.data.items);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addRemovePromoCode = async (data) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/checkout/coupon`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${customertoken}`,
        },
      });
      const resData = await res.json();
      if (resData.success === 200) {
        toast.success(resData?.message);
      } else {
        console.log("Error: ", resData?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const placeOrder = async (data) => {

    const customertoken = getToken();

    try {
      const res = await fetch(
        `${APIUrl}/${countryCode.toLowerCase()}/V1/carts/mine/payment-information`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customertoken}`,
          },
        }
      );
      const resData = await res.json();
      if (resData.success === 200) {
        toast.success("Order Placed Successfully.");
        router.push({ pathname: '/order-success', query: { id: 0 } })
      } else {
        console.log("Error: ", resData?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const paymentFreeApi = async (selectedMethod) => {

    const customertoken = getToken();

    try {
      const res = await fetch(
        `${APIUrl}/${countryCode.toLowerCase()}/V1/carts/mine/set-payment-information`,
        {
          method: "POST",
          body: JSON.stringify({
            paymentMethod: {
              method: selectedMethod.code,
            },
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customertoken}`,
          },
        }
      );
      const resData = await res.json();
      if (resData) {
       const selectedShippingMethod = sessionStorage.getItem('selectedShippingMethod')
       appData.getShippingInformation(selectedShippingMethod, false)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const applyPromoCode = (e) => {
    e.preventDefault();

    const quoteId = sessionStorage.getItem("quoteid");

    const applyCodeData = {
      data: {
        customer_id: appData?.customerDetails?.id,
        cart_id: quoteId,
        coupon: promoCode,
        remove: promoCode ? 0 : 1,
        token: customertoken,
      },
    };

    addRemovePromoCode(applyCodeData);
  };

  const toggleAddCardScreen = () => {
    setShowAddCardScreen(!showAddCardScreen);
  };

  const onBackFromCards = () => {
    setShowAddCardScreen(!showAddCardScreen);
    fetchCards()

  };

  const handlePayNow = () => {
    let data = {
      paymentMethod: {
        method: selectedMethod.code,
      },
    }

    if (countryCode === 'bd') {
      data = {
        paymentMethod: {
          method: selectedMethod.code,
          extension_attributes: {
            agreement_ids: ["1"],
          },
        },
      }
    }

    placeOrder(data)
  }

  const handleSelectPaymentMethod = (method) => {
    paymentFreeApi(method);
    setSelectedMethods(method)
  }

  useEffect(() => {
    fetchCards();
  }, []);

  return (
    <>
      <div className="select-payment-methods card-body">
        {/* Cards */}
        <h3>Select Payment Method</h3>
        <div className="payment-method-cards">
          {paymentMethods &&
            paymentMethods.map((card, cidx) => {
              return (
                <div
                  key={cidx}
                  className={selectedMethod === card ? "card active" : "card"}
                  onClick={() => handleSelectPaymentMethod(card)}
                >
                  <span className="pc-icon text-muted">
                    <FaCreditCard />
                  </span>
                  <div className="pc-text">{card.title}</div>
                </div>
              );
            })}
        </div>

        {/* COD Card message */}
        {selectedMethod && selectedMethod.code === "cashondelivery" && (
          <div className="card cod-message mb-4 rounded-lg">
            <div className="card-body">
              Cash or card on delivery with service fee of BHD 1. Card payment
              is subject to availability.
            </div>
          </div>
        )}

        {/* Add Card */}
        {selectedMethod && selectedMethod.code === "mp_stripe_credit_cards" && (
          <div className="available-cards">
            <Swiper
              slidesPerView={1.3}
              loop={false}
              autoplay={{ delay: 2500, disableOnInteraction: true }}
              spaceBetween={10}
              freeMode={true}
              modules={[FreeMode]}
            >
              {cardsList.map((card) => (
                <SwiperSlide key={card.card_id}>
                  <div
                    className="bg-primary blue-card-ui"
                    onClick={() => setSelectedCard(card)}
                  >
                    {selectedCard === card && (
                      <span className="bcui-icon">
                        <FaCheckCircle className="text-success" />
                      </span>
                    )}
                    <div className="card-number">
                      XXXX XXXX XXXX {getCardLastNumber(card.card_number)}
                    </div>
                    <div className="card-details">
                      <span>
                        <small>Holder Name</small>
                        <br />
                        <strong>{card.name}</strong>
                      </span>
                      <span>
                        <small>Exp Date</small>
                        <br />
                        <strong>{card.expiry_date}</strong>
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <SwiperSlide key="945459sdf">
                <div
                  onClick={() => toggleAddCardScreen()}
                  className="card add-card-box mb-4 shadow-sm"
                >
                  + Add Card
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        )}

        {/* Promo Code */}
        <div className="promocode-card">
          <h3 className="text-primary" onClick={() => setShowCouponForm(true)}>
            Have promocode?
          </h3>
          {showCouponForm && (
            <form
              autoComplete="off"
              action=""
              className="input-group mb-0"
              onSubmit={(e) => applyPromoCode(e)}
            >
              <input
                type="text"
                name="promocode"
                className="form-control"
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Enter promocode here."
              />
              <button type="submit" className="input-group-text text-primary">
                Apply
              </button>
            </form>
          )}
          {/* <span className="text-success">Promocode applied.</span> */}
        </div>

        {/* Sub totals */}
        <div className="card bg-light subtotals-card">
          <div className="subtotals-row">
            <span className="stlabel">Sub total:</span>
            <span className="stval">
              {totals?.total_segments["0"]?.value ?? 0}
            </span>
          </div>
          <div className="subtotals-row">
            <span className="stlabel">Shipping charges:</span>
            <span className="stval">
              {totals?.total_segments["1"]?.value ?? 0}
            </span>
          </div>
          <div className="subtotals-row">
            <span className="stlabel">Payment Fee:</span>
            <span className="stval">
              {totals?.total_segments["3"]?.value ?? 0}
            </span>
          </div>
          <div className="subtotals-row">
            <span className="stlabel">Promo Discount:</span>
            <span className="stval">
              {totals?.base_shipping_discount_amount ?? 0}
            </span>
          </div>
          <div className="subtotals-row">
            <span className="stlabel">Tax (15%):</span>
            <span className="stval">
              {totals?.total_segments["2"]?.value ?? 0}
            </span>
          </div>
          <hr />
          <div className="subtotals-row finaltotals">
            <span className="stlabel">Total:</span>
            <span className="stval">
              {totals?.total_segments["4"]?.value ?? 0}
            </span>
          </div>
        </div>

        {/* Order Summery */}
        <div className="order-summery">
          <h3>Order Summery</h3>
          <div className="order-details">
            {totals &&
              totals.items_qty > 0 &&
              totals.items.map((item, idx) => (
                <div key={item.item_id} className="card">
                  <div className="card-body">
                    <div className="cl-image">
                      <Image
                        src={`${imgUrl}${item.extension_attributes.product_image}`}
                        width={100}
                        height={100}
                        alt=""
                      />
                    </div>
                    <div className="clc-box">
                      <div className="card-title">{item.name}</div>
                      <div className="card-pricebox">
                        <span className="text-primary">{item.row_total}</span>
                        <span className="cl-qty">
                          <span>Quantity: {item.qty}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="payment-address">
          {/* Shipping Address */}
          <h3>Shipping Address</h3>
          <div className="shippingaddress">
            <div className="addresschecked">
              <FaCheckCircle className="text-success" />
            </div>
            <h3>{getFullname(appData.selectedShippingAddress)}</h3>
            <p>{getStreetText(appData.selectedShippingAddress)}</p>
          </div>

          {/* Billing Address */}
          <h3>Billing Address</h3>
          <div className="billing-address">
            <div className="addresschecked">
              <FaCheckCircle className="text-success" />
            </div>
            <h3>{getFullname(appData.selectedShippingAddress)}</h3>
            <p>{getStreetText(appData.selectedShippingAddress)}</p>
          </div>
        </div>
      </div>
      <div className="card-footer payment-footer">
        <div className="cart-totals">
          <div className="border-top-style"></div>
          <div className="cart-tprice">
            <span className="ctprice">{totals?.grand_total ?? 0}</span>
            <span>Total</span>
          </div>
          <div className="carttbtn">
            <button  onClick={() => handlePayNow()} className="btn btn-outline-light btn-lg">Pay Now</button>
          </div>
        </div>
      </div>

      {showAddCardScreen && (
        <AddCardScreen onBack={() => onBackFromCards()} />
      )}
    </>
  );
};

export default CheckoutPayment;
