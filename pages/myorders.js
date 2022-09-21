import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react"; 
import { AiOutlineFilter } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi"; 
import MyOrderDetailsCard from "../components/myorder/MyOrderDetailsCard";
import { getToken } from "../layout/utils";
import { AppContext } from "./_app";

const MyOrders = () => {
  const router = useRouter();
  const appData = useContext(AppContext);

  const APIUrl = process.env.NEXT_PUBLIC_API_URL;
  const countryCode = appData.countryCode;
  
  const [orgOrders, setOrgOrders] = useState([]);
  const [ordersList, setOrdersList] = useState([]);
 
  const fetchMyOrders = async () => {

    const customertoken = getToken();
    const customer_id = sessionStorage.getItem('customer_id');

    try {
      const res = await fetch(
        `${APIUrl}/${countryCode.toLowerCase()}/V1/myorders`,
        {
          method: "POST",
          body: JSON.stringify({
            data: {
              storecode: countryCode ? countryCode.toLowerCase() : '',
              customer_id: customer_id,
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
        setOrdersList(resData ?? []);
        setOrgOrders(resData ?? []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const handleSearchProduct = (keyword) => {

    let newOrders = [...orgOrders];

    if (keyword !== '' && keyword.length > 0) {
      newOrders = newOrders.filter(order => JSON.stringify(order).includes(keyword))
      setOrdersList(newOrders)
    } else {
      setOrdersList(orgOrders)
    }
  }

  return (
    <div className="my-orders-ui inner-page-ui">
      <div className="cart-header">
        <span onClick={() => router.back()} className="carent-icon-circle icon">
          <FiChevronLeft />
        </span>
        My Orders
      </div>

      <div className="search-bar my-order-search card-body">
        <span className="search-icon"><FaSearch />  </span>
        <form onSubmit={(e) => onSearchSubmit(e)}>
          <input 
          className='form-control' 
          name='psearch' 
          type="text" 
          onChange={(e) => handleSearchProduct(e.target.value)} 
          placeholder="Search Product" 
          />
        </form>
        <div className="filtericon">
        <AiOutlineFilter />
        </div>
      </div>

      <div className="card-body order-list-area">
        <div className="available-orders">
          {ordersList.length > 0 &&
            ordersList.map((order) => (
              <MyOrderDetailsCard
                key={order.order_id}
                order={order}
               /> 
            ))}
          {ordersList.length === 0 && <p>You do not have any order.</p>}
        </div>
      </div>

    </div>
  );
};

export default MyOrders;
