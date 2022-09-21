import Layout1 from "../layout/Layout";
import Layout2 from "../layout/Layout2";
import Layout3 from "../layout/Layout3";
import SlashLayout from "../layout/SlashLayout";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.css";
import "../styles/app-global.scss";
import { createContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import toast, { Toaster } from 'react-hot-toast';
import LayoutInner from "../layout/LayoutInner";
import { SelectCountryModal } from "../components/common/SelectCountryModal";
import { ComingSoonModal } from "../components/common/ComingSoonModal";
import { getCountryCode, getToken, getTokenType } from "../layout/utils";

export const AppContext = createContext({});

export default function MyApp({ Component, pageProps }) {
  let Layout = Layout1;

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  const router = useRouter()

  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [appAdmin, setAppAdmin] = useState('sd7t1sjb2z4rosaxnhm3o8lc0zw6wbmi');
  const [countryList, setCountryList] = useState([]);
  const [addressList, setAddressList] = useState({});
  const [shippingMethods, setShippingMethods] = useState([]);
  const [shippingInformation, setShippingInformation] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState({})
  const [customerDetails, setCustomerDetails] = useState({});
  const [countryCode, setCountryCode] = useState('');
  const [token, setToken] = useState('');
  const [showCountryModal, setShowCountryModal] = useState(false)
  const [showComingSoonModal, setShowComingSoonModal] = useState(false); 

  const openCountryModal = () => {
    setShowCountryModal(!showCountryModal)
  }

  const toggleComingSoon = () => {
    setShowComingSoonModal(false)
  }

  if ( router.pathname === "/" || 
    router.pathname === "/top-categories" || 
    router.pathname === "/select-country"
  ) {
    Layout = SlashLayout;
  }

  if (
    router.pathname === "/product/[sku]" ||
    router.pathname === "/products"
  ) {
    Layout = Layout2;
  }

  if (
    router.pathname === "/checkout" ||
    router.pathname === "/profile-details" ||
    router.pathname === "/faq-and-contact" ||
    router.pathname === "/write-to-us" ||
    router.pathname === "/checkout-sign-in" ||
    router.pathname === "/checkout-sign-up" ||
    router.pathname === "/checkout-forgot-password" ||
    router.pathname === "/sign-in" ||
    router.pathname === "/sign-up" ||
    router.pathname === "/myorders" ||
    router.pathname === "/order-details" ||
    router.pathname === "/forgot-password" ||
    router.pathname === "/order-success") {
    Layout = LayoutInner;
  }

  if (router.pathname === "/cart" ||
    router.pathname === "/my-cards" ||
    router.pathname === "/my-credit" ||
    router.pathname === "/my-returns" ||
    router.pathname === "/my-addresses" ||
    router.pathname === "/wishlist") {
    Layout = Layout3;
  }

  const appData = {
    token: token,
    customertoken: token,
    countryCode: countryCode,
    orderCount: orderCount,
    user: {
      username: 'James',
      addressList: addressList,
    },
    customerDetails: customerDetails,
    customerid: customerDetails.id,
    cart: {
      count: cartCount
    },
    adminToken: appAdmin,
    countryList: countryList,
    shippingMethods: shippingMethods,
    selectedShippingAddress: selectedShippingAddress,
    shippingInformation: shippingInformation,
    selectShippingAddress: (address) => {
      console.log('address selected', address);
      setSelectedShippingAddress(address)
      fetchShippingMethods(address);
    },
    deleteShippingAddress: (id) => {
      deleteShippingAddress(id)
    },
    addUpdateAddress: async (data, returnBack) => {
      await addUpdateCustomerAddress(data)
      returnBack()
    },
    getShippingInformation: async (method, redirect) => {
      await fetchShippingInformation(method, redirect)
    },
    setCountryCode: (code) => {
      setCountryCode(code)
    },
    openCountryModal: () => {
      openCountryModal(true)
    },
    openComingSoonModal: () => {
      setShowComingSoonModal(true)
    },
  };

  const fetchCartCount = async (customer_id) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/customer/get-cart-items-count`, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            store_code: countryCode ? countryCode : 'bh',
            customer_id: customer_id,
          }
        }),

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        setCartCount(resData.data.count ? resData.data.count : 0);
        localStorage.setItem('cartCount', resData.data.count ? resData.data.count : 0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchOrderCount = async () => {

    const customertoken = getToken();
    const admintoken = localStorage.getItem('appAdmin');
    const customer_id = sessionStorage.getItem('customer_id');
    const countryCode = getCountryCode()

    const url = `${APIUrl}/${countryCode}/V1/get-order-count`;

    const tokenType = getTokenType()
    if (tokenType === 'guest') {
      url = `${APIUrl}/${countryCode}/V1/guest-carts/${token}/get-order-count`;
    } 

    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            storecode: countryCode,
            admintoken: admintoken,
            customer_id: customer_id,
          }
        }),

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        setOrderCount(resData.data.count ? resData.data.count : 0);
        sessionStorage.setItem('orderCount', resData.data.count ? resData.data.count : 0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppAdmin = async () => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/V1/login/admin`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "password": "Newness@1020",
            "username": "api"
          }
        }),

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        setAppAdmin(resData.data.admintoken ? resData.data.admintoken : '');
        localStorage.setItem('appAdmin', resData.data.admintoken ? resData.data.admintoken : '');
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCustomerDetails = async () => {

    const customertoken = getToken();
    
    try {
      const res = await fetch(`${APIUrl}/V1/getcustomerdetails`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "customertoken": customertoken,
            "admintoken": appAdmin
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        setCustomerDetails(resData.data ? resData.data : {});
        sessionStorage.setItem('customer_id', resData.data.id);
        sessionStorage.setItem('customer', JSON.stringify(resData.data));
        fetchCartCount(resData.data.id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCountryList = async () => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/V1/countrylist`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "admintoken": appAdmin
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        setCountryList(resData.data ? resData.data : []);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserAddressList = async () => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/wt-customer/address-list`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      setAddressList(resData ? resData : {});
      if (resData && resData.items && resData.items.length > 0) {
        setSelectedShippingAddress(resData.items['0'])
        fetchShippingMethods(resData.items['0']);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deleteShippingAddress = async (id) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/wt-customer/address/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData) {
        console.log('Address deleted');
        fetchUserAddressList()
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchShippingMethods = async (selectedShippingAddress) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/carts/mine/estimate-shipping-methods`, {
        method: 'POST',
        body: JSON.stringify({
          "address": {
            "firstname": selectedShippingAddress?.firstname,
            "lastname": selectedShippingAddress?.lastname,
            "city": selectedShippingAddress?.city,
            "customer_id": selectedShippingAddress?.customer_id,
            "region_id": selectedShippingAddress?.region_id,
            "same_as_billing": 1,
            "email": selectedShippingAddress?.email,
            "region_code": selectedShippingAddress?.region?.region_code,
            "postcode": selectedShippingAddress?.postcode,
            "region": selectedShippingAddress?.region?.region,
            "telephone": selectedShippingAddress?.telephone,
            "country_id": selectedShippingAddress?.country_id,
            "street": selectedShippingAddress?.street
          }
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      setShippingMethods(resData ? resData : {});
    } catch (err) {
      console.log(err);
    }
  };

  const fetchShippingInformation = async (method, redirect) => {

    const customertoken = getToken();

    const data = {
      "addressInformation": {
        "shipping_carrier_code": method,
        "shipping_method_code": method,
        "shipping_address": {
          "customer_id": selectedShippingAddress.customer_id,
          "firstname": selectedShippingAddress.firstname,
          "lastname": selectedShippingAddress.firstname,
          "region_id": 0,
          "street": selectedShippingAddress.street,
          "city": selectedShippingAddress.city,
          "region": selectedShippingAddress.region.region,
          "postcode": selectedShippingAddress.postcode,
          "region_code": selectedShippingAddress.region.region_code,
          "country_id": selectedShippingAddress.country_id,
          "telephone": selectedShippingAddress.telephone
        },
        "billing_address": {
          "customer_id": selectedShippingAddress.customer_id,
          "firstname": selectedShippingAddress.firstname,
          "lastname": selectedShippingAddress.firstname,
          "region_id": 0,
          "street": selectedShippingAddress.street,
          "city": selectedShippingAddress.city,
          "region": selectedShippingAddress.region.region,
          "postcode": selectedShippingAddress.postcode,
          "region_code": selectedShippingAddress.region.region_code,
          "country_id": selectedShippingAddress.country_id,
          "telephone": selectedShippingAddress.telephone
        }
      }
    }

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/carts/mine/shipping-information`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })

      const resData = await res.json();
      if (res.status === 200) {
        setShippingInformation(resData ? resData : {});
        redirect && redirect();
      } else {
        toast.error(resData.message)
        console.log("Error", resData.message, data)
      }
    } catch (err) {
      console.log(err);
    }
  };

  const addUpdateCustomerAddress = async (data) => {

    const customertoken = getToken();

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/wt-customer/address-add-update`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      fetchUserAddressList()
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    const stoken = getToken();
    setToken(stoken);

    const ccode = localStorage.getItem('countryCode');
    if (ccode && ccode !== '' && ccode !== undefined) {
      setCountryCode(ccode)
    } else {
      router.push('/select-country')
    }

    fetchAppAdmin();
    fetchCountryList();
    fetchUserAddressList();
    fetchCustomerDetails();
    fetchShippingMethods(selectedShippingAddress);
    fetchOrderCount()
  }, [])

  return (
    <>
      <AppContext.Provider value={appData}>
        <Layout>
          <Component {...pageProps} />
          {showCountryModal && <SelectCountryModal onClose={() => openCountryModal()}/>}
          {showComingSoonModal && <ComingSoonModal onClose={() => toggleComingSoon()}/>}
          <Toaster
            position="bottom-center"
            reverseOrder={false} />
        </Layout>
      </AppContext.Provider>
    </>
  );
}
