import { useRouter } from "next/router";
import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaCalendarAlt, FaEnvelope, FaMobileAlt, FaRegEdit, FaTransgender, FaUserCircle } from "react-icons/fa";
import { FiChevronLeft } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { getFullname, getGenderName, getToken } from "../layout/utils";
import { AppContext } from "./_app";
import { AccountDetailsModal } from "../components/common/accountDetailsModal";
import { UpdatePasswordModal } from "../components/common/updatePasswordModal";
import { StoreModal } from "../components/common/storeModal";

const ProfileDetails = () => {

  const router = useRouter()
  const appData = useContext(AppContext);

  const APIUrl = process.env.NEXT_PUBLIC_API_URL;
 
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [accountFormData, setAccountFormData] = useState({});
  const [customerDetails, setCustomerDetails] = useState({});
  const [activeModal, setActiveModal] = useState('');


  const fetchCustomerDetails = async () => {

    const customertoken = getToken();
    const admintoken = localStorage.getItem('appAdmin');

    try {
      const res = await fetch(`${APIUrl}/V1/getcustomerdetails`, {
        method: 'POST',
        body: JSON.stringify({
          "data": {
            "customertoken": customertoken,
            "admintoken": admintoken
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
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  return (
    <>
      <div className="my-cards-ui profile-details-page  form-ui">
        <div className="cart-header">
          <span onClick={() => router.back()} className="carent-icon-circle icon">
            <FiChevronLeft />
          </span>
          Profile Details
        </div>

        <div className="card">
          <div className="card-body">
            <div className="cheader">
              <h3 className='card-heading'>Account Details <span onClick={() => setActiveModal('accountDetails')} className="btn btn-sm btn-light"><FaRegEdit /></span></h3>
            </div>
            <div className="cbody">
              <form onSubmit={(e) => handleOnSubmit(e)} className="auth-form mb-4">

                <div className="input-group mb-3">
                  <input
                    className='form-control bg-white'
                    type="text"
                    name="fullName"
                    readOnly
                    maxLength={40}
                    value={getFullname(customerDetails)}
                    placeholder='Enter your name'
                    onChange={(e) => handleOnFieldChange(e)}
                  />
                  <span className="input-group-text">
                    <img src="svg/user-circle.svg" alt="" />
                  </span>
                </div>

                <div className="input-group mb-3">
                  <input
                    className='form-control bg-white'
                    type="text"
                    name="email"
                    readOnly
                    maxLength={40}
                    value={customerDetails?.email}
                    placeholder='Enter your email'
                    onChange={(e) => handleOnFieldChange(e)}
                  />
                  <span className="input-group-text">
                    <img src="svg/email.svg" alt="" />
                  </span>
                </div>

                <div className="row gx-2">
                  <div className="col">
                    <div className="input-group mb-3">
                      <input
                        className='form-control bg-white'
                        type="text"
                        readOnly
                        name="gender"
                        maxLength={40}
                        value={getGenderName(customerDetails.gender)}
                        placeholder='Gender'
                        onChange={(e) => handleOnFieldChange(e)}
                      />
                      <span className="input-group-text">
                        <img src="svg/gender-icon.svg" alt="" />
                      </span>
                    </div>
                  </div>
                  <div className="col">
                    <div className="input-group mb-3">
                      <input
                        className='form-control bg-white'
                        type="text"
                        name="dob"
                        readOnly
                        maxLength={40}
                        value={customerDetails?.dob}
                        placeholder='yyyy-mm-dd'
                        onChange={(e) => handleOnFieldChange(e)}
                      />
                      <span className="input-group-text">
                        <img src="svg/calendar.svg" alt="" />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="row gx-2">
                  <div className="col-3">
                    <input
                      className='form-control bg-white'
                      type="text"
                      readOnly
                      name="mobileCode"
                      maxLength={40}
                      value={customerDetails?.country_code ? `+${customerDetails?.country_code}` : '+91'}
                      onChange={(e) => handleOnFieldChange(e)}
                    />
                  </div>
                  <div className="col">
                    <div className="input-group mb-3">
                      <input
                        className='form-control bg-white'
                        type="text"
                        name="mobileno"
                        readOnly
                        maxLength={40}
                        value={customerDetails?.mobileno}
                        placeholder='Number'
                        onChange={(e) => handleOnFieldChange(e)}
                      />
                      <span className="input-group-text">
                        <img src="svg/mobile.svg" alt="" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="update-pass-link text-end">
                  <span onClick={() => setActiveModal('updatePassword')} className='text-primary'>update password</span>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="cheader">
              <h3 className='card-heading'>Store <span onClick={() => setActiveModal('store')} className="btn btn-sm btn-light"><FaRegEdit /></span></h3>
            </div>
            <div className="cbody">
              <input
                className='form-control bg-light'
                type="text"
                name="store"
                maxLength={40}
                value={accountFormData?.store}
                onChange={(e) => handleOnFieldChange(e)}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="cheader">
              <h3 className='card-heading'>Your Favourite Brand <span className="btn btn-sm btn-light"><FaRegEdit /></span></h3>
            </div>
            <div className="cbody">
              <Swiper
                slidesPerView={2.5}
                loop={false}
                autoplay={{ delay: 2500, disableOnInteraction: true }}
                spaceBetween={10}
                freeMode={true}
                modules={[FreeMode]}
              >
                {[1, 2, 3].map((card) => (
                  <SwiperSlide key={card.card_id}>
                    <div
                      className="brands-cards"
                      onClick={() => { '' }}
                    >
                      <div className="card">
                        <div className="card-body">
                          <img src="svg/fav-brand-icon1.svg" alt="" />
                          <button className="btn btn-light btn-sm">Unfollow</button>
                        </div>
                      </div>

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="cheader">
              <h3 className='card-heading'>Size <span className="btn btn-sm btn-light"><FaRegEdit /></span></h3>
            </div>
            <div className="cbody">
              <Swiper
                slidesPerView={3.5}
                loop={false}
                autoplay={{ delay: 2500, disableOnInteraction: true }}
                spaceBetween={10}
                freeMode={true}
                modules={[FreeMode]}
              >
                {[1, 2, 3].map((card) => (
                  <SwiperSlide key={card.card_id}>
                    <div
                      className="sizes-cards"
                      onClick={() => { '' }}
                    >
                      <div className="card">
                        <div className="card-body">
                          <img src="svg/shirt-icon.svg" alt="" />
                          <span>T Shirt</span>
                        </div>
                      </div>

                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="cheader">
              <h3 className='card-heading'>Notification &amp; Email <span className="btn btn-sm btn-light"><FaRegEdit /></span></h3>
            </div>
            <div className="cbody subscription-message">
              <div className="card-body bg-light">
                <input type="checkbox" name='subscribe' />
                Subscribe to our newslettters and get latest sale and discount
              </div>
            </div>
          </div>

          <div className="card-body py-0">
            <div className="card-body bg-light py-4 mb-3">
              <h3 className='card-heading justify-content-center'>Copyright Newness 2022</h3>
              <h3 className='card-heading justify-content-center mb-4'>App Version 2.1</h3>
              <h3 className='card-heading justify-content-center'>Out terms and Conditions </h3>
            </div>
          </div>

          <div className="card-body mb-2">
            <div className="row">
              <div className="col">
                <button className='btn btn-light w-100' >Logout</button>
              </div>
              <div className="col">
                <button className='btn btn-primary w-100'>Update</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {activeModal && activeModal === 'accountDetails' &&
        <AccountDetailsModal
          onClose={setActiveModal}
          customerDetails={customerDetails}
        />
      }
      {activeModal && activeModal === 'updatePassword' &&
        <UpdatePasswordModal
          onClose={setActiveModal}
          customerDetails={customerDetails}
        />
      }
      {activeModal && activeModal === 'store' &&
        <StoreModal
          onClose={setActiveModal}
          customerDetails={customerDetails}
        />
      }
    </>

  );
};

export default ProfileDetails;
