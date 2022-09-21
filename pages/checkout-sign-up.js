
import React from 'react'
import Image from 'next/image'; 
import {
  MdOutlineArrowBackIosNew
} from 'react-icons/md'; 
import Link from "next/link";
import { useRouter } from 'next/router'; 
import SignUp from './sign-up';

export default function Checkout() {

  const router = useRouter();
 
  const handleCheckoutGoBack = () => {
    router.back()
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header bg-primary text-white">
        <div onClick={() => handleCheckoutGoBack()} className="go-back">
          <MdOutlineArrowBackIosNew />
        </div>
        <div className="sitelogo">
          <Link href="/home"><Image src="/logo.png" alt="Newness" width={696 * 0.2} height={142 * 0.2} /></Link>
        </div>
      </div>


      <div className={`card checkout-card`}>
        <div className="card-header">
          <button
            className='btn btn-primary'>
            Sign in
          </button>

          <button
            className='btn btn-primary'>
            Location
          </button>
          <button
            className='btn btn-primary'
          >
            Payment
          </button>
        </div>

        <SignUp hideHeader={true} isCheckout={true} />

      </div>


    </div>
  );
}
