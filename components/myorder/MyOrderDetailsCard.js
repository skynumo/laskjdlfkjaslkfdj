import Image from 'next/image'
import Link from 'next/link';
import React, { useState } from 'react'
import { FiChevronRight } from 'react-icons/fi'

const MyOrderDetailsCard = (props) => {
  const order = props.order;

  const [showItems, toggleShowItems] = useState(false)

  return (
    <div
      key={order.order_id}
      className="card"
    >
      <div className="card-body">
        <div className="orderno mb-1">Order No: {order?.increment_id} </div>
        <div className="status text-success  mb-1">Status: {order?.status}</div>
        <div className="orderno">Create Date: {order?.created_at}</div>
        { order.items && order.items.length > 0 && <div 
         onClick={() => toggleShowItems(!showItems)}
         className="more-details main-card open">
          <FiChevronRight />
        </div>
        }

        {showItems && <div className="mt-3 card-items order-details">
          {order.items && order.items.map((item, idx) => {
            return <div key={item.item_id} className="card">
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
                  <div className="card-name">{item.name}</div>
                  <div className="card-sku">Sku: {item.sku}</div>
                  <div className="cl-qty">Qty: {item.qty}</div>
                </div>
                <div className="more-details">
                  <Link href={{ pathname: '/order-details', query: { id: order.order_id } }}><FiChevronRight /></Link>
                </div>
              </div>
            </div>
          })}
        </div>}
      </div>
    </div>
  )
}

export default MyOrderDetailsCard