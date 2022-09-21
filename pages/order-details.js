import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaFileDownload, FaTruck } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import { Modal } from "../components/common/modal";
import { AppContext } from "./_app"; 
import { Loader } from "../components/common/Loader";
import { saveAs } from "file-saver";
import { getToken } from "../layout/utils";

const OrderDetails = () => {
  const router = useRouter();

  const appData = useContext(AppContext);

  const APIUrl = process.env.NEXT_PUBLIC_API_URL;
  const countryCode = appData.countryCode;

  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [orderId, setOrderId] = useState(router?.query?.id);
  
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState({});
  const orderSummary = orderDetails['Order Summury'];
  const [selectedOrder, setSelectedOrder] = useState(
    orderDetails.length > 0 ? orderDetails["0"] : {}
  );

  const fetchOrderDetails = async (orderId) => {

    const customertoken = getToken();
    const admintoken = localStorage.getItem('appAdmin');
    setLoading(true)
    try {
      const res = await fetch(
        `${APIUrl}/${countryCode.toLowerCase()}/V1/order-detail`,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              storecode: countryCode ? countryCode.toLowerCase() : '',
              admintoken: admintoken,
              orderId: orderId,
            },
          }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${customertoken}`,
          },
        }
      );
      const resData = await res.json(); 
      if (res.status === 200) {
        setOrderDetails(resData.data ?? {});
      } else {
        toast(resData.message)
      }
      setLoading(false)
    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (router.query.id !== undefined) {
      setOrderId(router.query.id)
      fetchOrderDetails(router.query.id);
    } 
  }, [router]);

  const postCancelOrder = async (order_id) => {

    const admintoken = localStorage.getItem('appAdmin');
    const countryCode = localStorage.getItem('countryCode');
    const customertoken = getToken();
    try {
      const res = await fetch(
        `${APIUrl}/${countryCode.toLowerCase()}/V1/cancelorder`,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              admintoken: admintoken,
              order_id: order_id,
              storecode: countryCode ? countryCode.toLowerCase() : '',
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
        console.log('resData', resData.message)
        if (resData.message && (resData.message == "You can not cancel the order after 12 hours")) {
          toast.error("You can not cancel the order after 12 hours");
        } else {
          toast.success("Order Cancelled.");
          router.push('/myorders')
        }
        setCancelConfirm(false);
      } else {
        console.log("Error: ", resData?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancelConfirm = (order) => {
    setCancelConfirm(true); 
    setSelectedOrder(order);
  };

  const handleDownloadInvoice = (order) => {
    toast('Starting download...')
    setTimeout(() => {
      if (order && order['Order Id']) {
        const order_id = order['Order Id'];
        saveAs(
          `https://newness.net/row/pdfinvoice/order/prints/order_id/${order_id}`,
          "newness-order-invoice.pdf"
        );
      } else {
        toast.error('Error in downloading invoice file.')
      }
    }, 2000);
  }

  const confirmCancelOrder = () => {
    if (selectedOrder && selectedOrder['Order Id']) {
      const order_id = selectedOrder['Order Id'];
      postCancelOrder(order_id);
    } else {
      toast.error('Selected order not found. Please refresh and try again.')
    }
  };

  const closeCancelOrder = () => {
    setCancelConfirm(false);
  };

  return (
    <div className="my-orders-ui inner-page-ui">
      <div className="cart-header">
        <span onClick={() => router.back()} className="carent-icon-circle icon">
          <FiChevronLeft />
        </span>
        Order Details
      </div>

      {orderDetails && !loading &&
        <div className="my-order-details card-body">
          <div className="mb-3 big-details card-items order-details">
            {orderDetails.items && orderDetails.items.map((item, idx) => {
              return <div key={idx} className="card">
                <div className="card-body">
                  <div className="cl-image">
                    <Image
                      src={`${item?.image}`}
                      width={100}
                      height={100}
                      alt=""
                    />
                  </div>
                  <div className="clc-box">
                    <div className="fw-bold card-name d-flex align-items-center justify-content-between">
                      <span>{item.brand}</span>
                      <span className="text-primary">{item.price}</span>
                    </div>
                    <div className="card-name">{item.product_name}</div>
                    <div className="cl-qty">Quantity: {item.quantity}</div>
                  </div>
                </div>
              </div>
            })}
          </div>

          <div className="mb-3 cancel-download d-flex align-items-center justify-content-between">
            <button onClick={() => handleCancelConfirm(orderDetails?.order)} className="btn-primary btn"><FaTruck /> Cancel Order</button>
            <button onClick={() => handleDownloadInvoice(orderDetails?.order)} className="btn-primary btn"><FaFileDownload /> Invoice</button>
          </div>

          {orderDetails.order && 
            <div className="gray-card-ui">
              <h3>Order Details</h3>
              <p><span>Order Date: </span>{orderDetails?.order['Order Date']}</p>
              <p><span>Order: </span>{orderDetails?.order?.order_increment_id}</p>
            </div>
          }

          <div className="gray-card-ui">
            <h3>Payment Method</h3>
            <p>{orderDetails["Payment method"]}</p>
          </div>

          <div className="gray-card-ui">
            <h3>Billing Address</h3>
            <p>{orderDetails['billing address']?.firstname} {orderDetails['billing address']?.lastname}</p>
            <p>{orderDetails['billing address']?.street}  {orderDetails['billing address']?.city} {orderDetails['billing address']?.country_id}-{orderDetails['billing address']?.postcode}</p>
          </div>

          <div className="gray-card-ui">
            <h3>Shipping Address</h3>
            <p>{orderDetails['Shipping address']?.firstname} {orderDetails['Shipping address']?.lastname}</p>
            <p>{orderDetails['Shipping address']?.street}  {orderDetails['Shipping address']?.city} {orderDetails['Shipping address']?.country_id}-{orderDetails['Shipping address']?.postcode}</p>
          </div>

          <div className="order-summery">
            <h3>Order Summery</h3>
            {orderSummary && 
              <div className="card bg-light subtotals-card">
                <div className="subtotals-row">
                  <span className="stlabel">Sub total:</span>
                  <span className="stval">
                    {orderSummary?.subtotal ?? 0}
                  </span>
                </div>
                <div className="subtotals-row">
                  <span className="stlabel">Shipping charges:</span>
                  <span className="stval">
                    {orderSummary['shipping charges'] ?? 0}
                  </span>
                </div>
                <div className="subtotals-row">
                  <span className="stlabel">Payment Fee:</span>
                  <span className="stval">
                    {orderSummary?.payment_fee ?? 0}
                  </span>
                </div>
                <div className="subtotals-row">
                  <span className="stlabel">Promo Discount:</span>
                  <span className="stval">
                    {orderSummary['promo discount'] ?? 0}
                  </span>
                </div>
                <div className="subtotals-row">
                  <span className="stlabel">Tax (15%):</span>
                  <span className="stval">
                    {orderSummary?.tax ?? 0}
                  </span>
                </div>
                <hr />
                <div className="subtotals-row finaltotals">
                  <span className="stlabel">Total:</span>
                  <span className="stval">
                    {orderSummary?.total ?? 0}
                  </span>
                </div>
              </div>
            }
          </div>


        </div>
      }

      {loading && <Loader />}
      
      {cancelConfirm && (
        <Modal
          title="Newness"
          content="Are you sure you want to cancel this order?"
          onClose={() => closeCancelOrder()}
          onConfirm={() => confirmCancelOrder()}
          closeBtnLabel= 'No'
          confirmBtnLabel= 'Yes'
        />
      )}
    </div>
  );
};

export default OrderDetails;
