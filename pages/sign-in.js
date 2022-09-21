
import React, { useState } from 'react'
import Image from 'next/image';
import {
  MdOutlineArrowBackIosNew
} from 'react-icons/md';
import Link from "next/link";
import { useRouter } from 'next/router';
import toast from 'react-hot-toast'; 
import { getCountryCode } from '../layout/utils';
import { Loader } from '../components/common/Loader';
import { BsEye, BsEyeSlash } from 'react-icons/bs';

export default function SignIn(props) {

  const APIUrl = process.env.NEXT_PUBLIC_API_URL
 
  const router = useRouter();
  const { skip, hideBack, category, cat, idx } = router.query;

  const urlQuery = {
    category: category,
    cat: cat,
    idx: idx,
  }

  const [formData, setFormData] = useState({ emailormobile: '', password: '' });
  const [passwordType, setPasswordType] = useState('password');
  const [loginLoader, setLoginLoader] = useState(false);

  const handleOnFieldChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (formData.emailormobile === '') {
      toast('Please add email or mobile number.')
      return 
    }

    if (formData.password === '') {
      toast('Please add password.')
      return 
    }

    postSignIn()
  }

  const postSignIn = async () => {

    setLoginLoader(true)
    const countryCode = getCountryCode()

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/wt-customer/login`, {
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
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        toast.success('You are logged in succesfully.')
        sessionStorage.setItem('token', resData.data.customertoken)
        sessionStorage.setItem('tokenType', 'login');
        router.push({pathname: `/home/${category}`, query: urlQuery})
      } else {
        console.log('Error occured while getting token.')
      }
      setLoginLoader(false)
    } catch (err) {
      console.log(err);
      setLoginLoader(false)
    }

    setTimeout(() => {
      setLoginLoader(false)
    }, 5000);
  };

  const handleOnSkip = async () => {
    const countryCode = getCountryCode()

    try {
      const res = await fetch(`${APIUrl}/${countryCode}/V1/guest-carts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (res.status === 200) {
        const resData = await res.json();
        console.log('Skipped login.')
        sessionStorage.setItem('guestToken', resData)
        sessionStorage.setItem('tokenType', 'guest');
        router.push({pathname: `/home/${category}`, query: urlQuery})
      } else {
        console.log('Error occured while getting guest token.')
      }
    } catch (err) {
      console.log(err);
    }
    
  }

  return (
    <div className="auth-pages">

      {!props.hideHeader && 
        <div className="checkout-header bg-primary text-white">
          {!hideBack && 
            <div onClick={() => router.back()} className="go-back">
              <MdOutlineArrowBackIosNew />
            </div>
          }
          <div className="sitelogo">
            <Link href="/home"><Image src="/logo.png" alt="Newness" width={696 * 0.2} height={142 * 0.2} /></Link>
          </div>
          {skip && <span onClick={() => handleOnSkip()} className="skip-link text-white">Skip</span>}
        </div>
      }

      <div className="card page-card">
        <div className="card-body">
          <div className="cheader">
            <h3 className='main-heading'>Log In</h3>
            <p className='text-muted'>Don&apos;t have an account? <Link href={props.isCheckout ? "/checkout-sign-up" : "/sign-up"}><span className='text-primary'>Sign Up</span></Link></p>
          </div>
          <div className="cbody">
            <form onSubmit={(e) => handleOnSubmit(e)} className="auth-form mb-4">
              <div className="email-mobile-field">
                <input
                  className='form-control'
                  type="text"
                  name="emailormobile"
                  maxLength={40}
                  value={formData?.emailormobile}
                  placeholder='E - mail Id or Mobile No.'
                  onChange={(e) => handleOnFieldChange(e)}
                />
                <span className="icon text-muted">
                  <img src="svg/email.svg" alt="" />
                </span>
              </div>
              <div className="password-field">
                <input
                  className='form-control'
                  type={passwordType}
                  name="password"
                  maxLength={30}
                  placeholder='Password'
                  value={formData?.password}
                  onChange={(e) => handleOnFieldChange(e)}
                />
                <div className="icon text-muted">
                  <span onClick={() => setPasswordType(passwordType === 'password' ? 'text' : 'password')}>
                    {passwordType === 'password' ? <BsEyeSlash /> : <BsEye />}
                  </span>
                  <span>
                    <img src="svg/lock.svg" alt="" />
                  </span>
                </div>
              </div>
              <div className="forgot-pass text-end">
                <Link href={props.isCheckout ? "/checkout-forgot-password" : "/forgot-password"}><span className='text-muted'>Forgot Password?</span></Link>
              </div>
              <button className='btn btn-primary btn-lg w-100'>
                Log in {loginLoader && <Loader type="inline-loader" />}
              </button>
            </form>
            <p className='font-bold text-center mb-5'>OR</p>
            <div className="auth-social-login">
                <img src="/facebook-icon.png" alt="Facebook" />
                <img src="/google-icon.png" alt="Google" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
