
import React, { useContext, useState } from 'react'
import Image from 'next/image'; 
import Link from "next/link";
import { useRouter } from 'next/router';
import toast from 'react-hot-toast'; 
import { getCountryCode, getToken } from '../layout/utils';
import { Loader } from '../components/common/Loader';

export default function ForgetPassword(props) {

  const router = useRouter();

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
 
  const [formData, setFormData] = useState({ mobile: ''}); 
  const [forPassLoader, setForPassLoader] = useState(false);

  const handleOnFieldChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const forgotPassword = async () => {

    setForPassLoader(true);
    const customertoken = getToken();
    const countryCode = getCountryCode()

    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/wt-customer/forgot-password`, {
        method: 'POST',
        body: JSON.stringify({
          login: {
            password: formData.password,
            quote_mask_id: "",
            username: formData.emailormobile,
            country_code: countryCode,
            social: false,
            is_phone: false,
            phone_number: ""
          }
        }),

        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${customertoken}`,
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        toast.success('You are logged in succesfully.')
        sessionStorage.setItem('token', resData.data.customertoken)
        router.push("/")
      } else {
        toast.error('Incorrect password or email.')
      }
      setForPassLoader(false);
    } catch (err) {
      console.log(err);
      setForPassLoader(false);
    }

    setTimeout(() => {
      setForPassLoader(false)
    }, 5000);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (formData.mobile === '') {
      toast('Please add mobile number.')
      return 
    }

    forgotPassword()
  }

  return (
    <div className="auth-pages forgot-password-page">

    {!props.hideHeader && 
      <div className="checkout-header bg-primary text-white">
        <div className="sitelogo">
          <Link href="/home"><Image src="/logo.png" alt="Newness" width={696 * 0.2} height={142 * 0.2} /></Link>
        </div>
        <div className="close-page">
          <Link href="/sign-in">&times;</Link>
        </div>
      </div>
    }

      <div className="card page-card">
        <div className="card-body">
          <div className="cheader">
            <h3 className='main-heading'>Forget Password</h3>
            <p className='text-muted'>Enter your registered mobile number to send OTP.</p>
          </div>
          <div className="cbody">
            <form onSubmit={(e) => handleOnSubmit(e)} className="auth-form">
              <div className="email-mobile-field">
                <input
                  className='form-control'
                  type="text"
                  name="mobile"
                  value={formData?.mobile}
                  placeholder='Enter Mobile Number'
                  onChange={(e) => handleOnFieldChange(e)}
                />
              </div>
              <button className='btn btn-primary btn-lg w-100'>
                Recovery {forPassLoader && <Loader type="inline-loader" />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
