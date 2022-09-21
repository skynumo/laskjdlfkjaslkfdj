import Image from 'next/image'
import React, { useState } from 'react'
import { getFullname, getGenderName } from '../../layout/utils'
import { Loader } from './Loader'

export const UpdatePasswordModal = (props) => {

  const { currentPassword } = props;

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
                <h5 className="modal-title">Password Update</h5>
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
                      name="currentPassword"
                      maxLength={40}
                      placeholder='Current Password'
                    // onChange={(e) => handleOnFieldChange(e)}
                    />
                    <span className="input-group-text">
                      <img src="svg/lock.svg" alt="" />
                    </span>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      className='form-control bg-white'
                      type="text"
                      name="newPassword"
                      maxLength={40}
                      placeholder='New Password'
                    // onChange={(e) => handleOnFieldChange(e)}
                    />
                    <span className="input-group-text">
                      <img src="svg/lock.svg" alt="" />
                    </span>
                  </div>
                  <div className="input-group mb-3">
                    <input
                      className='form-control bg-white'
                      type="text"
                      name="confirmPassword"
                      maxLength={40}
                      placeholder='Confirm Password'
                    // onChange={(e) => handleOnFieldChange(e)}
                    />
                    <span className="input-group-text">
                      <img src="svg/lock.svg" alt="" />
                    </span>
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
