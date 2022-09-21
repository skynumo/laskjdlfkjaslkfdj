
import React, { useState } from 'react'
import Image from 'next/image';
import { FaCheck } from 'react-icons/fa';
import {
  MdOutlineArrowBackIosNew
} from 'react-icons/md';
import CheckoutLocation from '../components/checkout/CheckoutLocation';
import CheckoutPayment from '../components/checkout/CheckoutPayment';
import Link from "next/link";
import { useRouter } from 'next/router';

export default function Checkout() {

  const router = useRouter();
  const [checkoutStep, setCheckoutStep] = useState(2);

  const onContinue = () => {
    setCheckoutStep(checkoutStep + 1)
  }

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

      <div className={`card checkout-card checkoutpage${checkoutStep}`}>
        <div className="card-header">
          <button
            className={checkoutStep === 1 ? 'btn btn-primary' : 'btn btn-default bg-light'}>
            {checkoutStep > 1 && <FaCheck className='text-success' />}
            Sign in
          </button>

          <button
            className={checkoutStep === 2 ? 'btn btn-primary' : 'btn btn-default bg-light'}>
            {checkoutStep > 2 && <FaCheck className='text-success' />}
            Location
          </button>
          <button
            className='btn btn-primary'
          >
            Payment
          </button>
        </div>

        {checkoutStep === 1 &&
          <CheckoutLocation step={checkoutStep} onContinue={() => onContinue()} />
        }

        {checkoutStep === 2 &&
          <CheckoutLocation step={checkoutStep} onContinue={() => onContinue()} />
        }

        {checkoutStep === 3 &&
          <CheckoutPayment step={checkoutStep} onNext={() => onNext()} />
        }
      </div>
    </div>
  );
}
