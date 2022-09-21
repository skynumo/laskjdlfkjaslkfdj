
import React, { useContext, useState } from 'react'
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from 'next/router';
import {
  MdOutlineArrowBackIosNew
} from 'react-icons/md';
import { FaMobileAlt } from 'react-icons/fa';
import toast from 'react-hot-toast'; 
import { Loader } from '../components/common/Loader';
import { getCountryCode } from '../layout/utils';

export default function SignUp(props) {

  const router = useRouter();

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
   
  const [formData, setFormData] = useState({ mobile: '' });
  const [signupLoader, setSignupLoader] = useState(false);
  
  const handleOnFieldChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const postRegister = async () => {
    setSignupLoader(true)
    
    const countryCode = getCountryCode(); 

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/wt-customer/register`, {
        method: 'POST',
        body: JSON.stringify({
          register: {
            firstname: '',
            lastname: '',
            password: formData.password,
            email: formData.emailormobile,
            social: false,
            phone_number: "",
            gender: "1",
            dob: "",
            country_code: "+91"
          }
        }),

        headers: {
          'Content-Type': 'application/json',
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        toast.success('You are registered succesfully.')
        if(props.isCheckout) {
          router.push("/checkout-sign-in")
        } else {
          router.push("/sign-in")
        }
        setSignupLoader(false)
      }
    } catch (err) {
      console.log(err);
      setSignupLoader(false)
    }

    setTimeout(() => {
      setSignupLoader(false)
    }, 5000);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (formData.mobile === '') {
      toast('Please add mobile number.')
      return 
    }

    postRegister()
  }

  return (
    <div className="auth-pages signup-password-page">

      {!props.hideHeader && 
        <div className="checkout-header bg-primary text-white">
          <div onClick={() => router.back()} className="go-back">
            <MdOutlineArrowBackIosNew />
          </div>
          <div className="sitelogo">
            <Link href="/home"><Image src="/logo.png" alt="Newness" width={696 * 0.2} height={142 * 0.2} /></Link>
          </div>
        </div>
      }

      <div className="card page-card">
        <div className="card-body  mt-5">
          <div className="cbody">
            <form onSubmit={(e) => handleOnSubmit(e)} className="auth-form">
              <div className="email-mobile-field two-field">
                <input
                  className='form-control mb-3'
                  type="text"
                  name="mobileprefix"
                  value="+973"
                />
                <input
                  className='form-control mb-3'
                  type="text"
                  name="mobile"
                  value={formData?.mobile}
                  placeholder='Enter Mobile Number'
                  onChange={(e) => handleOnFieldChange(e)}
                />
                <div className="icon text-muted">
                  <img src="svg/mobile.svg" alt="" />
                </div>
              </div>
              <p className='text-muted text-center mb-5'>Used to identify your account and for a smooth delivery experience.</p>
              <button className='btn btn-primary btn-lg w-100'>
                Next {signupLoader && <Loader type="inline-loader" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
