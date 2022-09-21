import Image from 'next/image'
import React, { useState } from 'react'
import { getFullname, getGenderName } from '../../layout/utils'
import { Loader } from './Loader'

export const AccountDetailsModal = (props) => {

  const { customerDetails } = props;

  const [showLoader, setShowLoader] = useState(false)

  const onConfirm = () => {
    setShowLoader(true)
    setTimeout(() => {
      setShowLoader(false)
    }, 5000);
  }

  const onClose = () => {
    props.onClose && props.onClose();
  }

  return (
    <React.Fragment>
      <div className='app-modal-ui profile-modal'>
        <div className="modal fade show">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"> Account Details</h5>
                {props.showCloseIcon && <button onClick={() => onClose()} type="button" className="close">
                  <span>&times;</span>
                </button>
                }
              </div>
              <div className="modal-body text-muted px-3 form-ui">
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
                    <div className="col-5">
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
                        value={customerDetails?.country_code ?? '+91'}
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
                </form>
              </div>
              <div className="modal-footer btn-styles">
                <button onClick={() => onClose('')} type="button" className="btn btn-light">{props.closeBtnLabel ?? 'Cancel'}</button>
                <button onClick={() => onConfirm()}
                  type="button"
                  className="btn btn-primary"
                  disabled={showLoader}
                >
                  {props.confirmBtnLabel ?? 'Update'}
                  {showLoader && <Loader type='sm' />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
