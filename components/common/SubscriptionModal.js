import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../pages/_app';
import { toast } from 'react-hot-toast'
import { getToken } from '../../layout/utils';

export const SubscriptionModal = () => {

  const appData = useContext(AppContext)
  
  const APIUrl = process.env.NEXT_PUBLIC_API_URL
  // const countryCode = appData.countryCode; 

  const [showSubscriptionForm, setShowSubscriptionForm] = useState(false)

  const subscribe = () => {
    console.log('customer details', appData.customerDetails)
    postSubscribe()
  }

  const subscribeLater = () => {
    sessionStorage.setItem('subscribe', 'later');
    setShowSubscriptionForm(false);
  }

  const postSubscribe = async () => {

    const token = getToken();
    const adminToken = sessionStorage.getItem('adminToken');
    const customerid = sessionStorage.getItem('customer_id');

    try {
      const res = await fetch(`${APIUrl}/V1/newslatter/subscribe`, {
        method: 'POST',
        body: JSON.stringify({
          data: {
            email: appData.customerDetails.email,
            customertoken: token,
            admintoken: adminToken,
            customerid: customerid
          }
        }),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })

      const data = await res.json(); 
      console.log('Subscribe', data, res);
      if (res.status === 200) {
        // setAddToCartSuccess(true);
        toast('You are subscribed successfully.')
        localStorage.setItem('subscribed', 'yes');
      } else {
        toast(res.message)
      }
    } catch (err) {
      console.log(err);
      setAddToCartSuccess(false);
    }
  };

  useEffect(() => {
    const subs = localStorage.getItem('subscribed');
    if (subs && subs !== null && subs !== undefined && subs === 'yes') {
      setShowSubscriptionForm(false)
    } else {
      const subsLater = sessionStorage.getItem('subscribe');
      if (subsLater && subsLater !== null && subsLater !== undefined && subsLater === 'later') {
        setShowSubscriptionForm(false)
      } else {
        setTimeout(() => {
          setShowSubscriptionForm(true)
        }, 5000);
      } 
    } 

  }, [])
  

  return (
    <React.Fragment>
    {showSubscriptionForm && 
      <div className='app-modal-ui subscription-modal'>
        <div className="modal fade show">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <img className='subscribe-now-image' src={"subscribeNow.jpg"} alt="" />
              <div className="modal-footer d-block">
                <button onClick={() => subscribeLater()} type="button" className="btn btn-outline-light">Later</button>
                <button onClick={() => subscribe()} type="button" className="btn btn-primary">Subscribe Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
    </React.Fragment>
  )
}