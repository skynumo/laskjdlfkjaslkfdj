import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast"; 
import { FiChevronLeft } from "react-icons/fi"; 
import { AppContext } from "./_app";

const WriteToUs = () => {
  
  const APIUrl = process.env.NEXT_PUBLIC_API_URL
 
  const appData = useContext(AppContext) 
  const countryCode = appData.countryCode;

  const router = useRouter()

  const initData = { name: '', email: '' , phone: '', comment: ''};
  const [formData, setFormData] = useState(initData);

  const handleOnFieldChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value })
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();

    if (formData.name === '') {
      toast('Please add your name.')
      return 
    }

    if (formData.email === '') {
      toast('Please add your email')
      return 
    }

    if (formData.phone === '') {
      toast('Please add your phone number')
      return 
    }

    if (formData.comment === '') {
      toast('Please add comment')
      return 
    }

    postComment()
  }

  const postComment = async () => {
    try {
      const res = await fetch(`${APIUrl}/${countryCode.toLowerCase()}/V1/contactus/save-request/`, {
        method: 'POST',
        body: JSON.stringify({
          data: formData
        }),

        headers: {
          'Content-Type': 'application/json',
        }
      })
      const resData = await res.json();
      if (resData.success === 200) {
        toast.success('Thank you for contacting us.')
        setFormData(initData)
      } else {
        toast.error(resData.message)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="write-to-ui">
      <div className="cart-header text-center">
        <span onClick={() => router.back()} className="carent-icon-circle icon">
          <FiChevronLeft />
        </span>
        Write to Us
      </div>
      <div className="card-body">
      <h4>Your feedback is about our:</h4>
      <form onSubmit={(e) => handleOnSubmit(e)} className="mb-4">
        <input
          className='form-control'
          type="text"
          name="name"
          maxLength={40}
          value={formData?.name}
          placeholder='Your Name'
          onChange={(e) => handleOnFieldChange(e)}
        />
        <input
          className='form-control'
          name="email"
          maxLength={40}
          placeholder='Your Email'
          value={formData?.email}
          onChange={(e) => handleOnFieldChange(e)}
        />
        <input
          className='form-control'
          name="phone"
          maxLength={40}
          placeholder='Your Phone'
          value={formData?.phone}
          onChange={(e) => handleOnFieldChange(e)}
        />
        <textarea
          className='form-control'
          name="comment"
          maxLength={400}
          rows={6}
          placeholder='Your Questions..'
          value={formData?.comment}
          onChange={(e) => handleOnFieldChange(e)}
        ></textarea>
        <button className='btn btn-primary btn-lg w-100' >SUBMIT</button>
      </form>
      </div>
    </div>
  );
};

export default WriteToUs;
