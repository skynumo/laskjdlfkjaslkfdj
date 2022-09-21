import Link from 'next/link';
import React from 'react'
import {
  FaCheck
} from "react-icons/fa";

const OrderSuccess = (props) => {
  const orderid = props.orderid ? props.orderid : '';
  return (
    <div className='order-success-page'>  
      <div className="close-page">
        <Link href="/home">&times;</Link>
      </div>
      <div className='success-card'>
        <div className='icon text-primary'>
          <FaCheck />
        </div>
        <h3>Order Placed Successfully.</h3>
        <div className='order-content'>
          Your order number #{orderid} has been placed. Find the delivery status on the My Orders page.
        </div>
        <Link href="/products"><button className='btn btn-primary btn-lg'>Continue Shopping</button></Link>
      </div>
    </div>
  )
}

export default OrderSuccess