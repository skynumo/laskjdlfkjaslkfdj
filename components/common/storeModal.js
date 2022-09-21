import Image from 'next/image'
import React, { useState } from 'react'
import { getStoreTypes } from '../../layout/utils'
import { Loader } from './Loader'

export const StoreModal = (props) => {

  const [activeStore, setActiveStore] = useState()
  const [showLoader, setShowLoader] = useState(false)
  
  const storeTypes = getStoreTypes()

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
                <h5 className="modal-title">Store</h5>
                {props.showCloseIcon && <button onClick={() => onClose()} type="button" className="close">
                  <span>&times;</span>
                </button>
                }
              </div>
              <div className="modal-body text-muted px-3 form-ui">
                <form onSubmit={(e) => handleOnSubmit(e)} className="auth-form mb-4">

                  {storeTypes.map((store, idx) => {
                    return <div key={idx} className="input-group mb-3">
                      <span
                        className='form-control bg-white text-start'
                        onClick={() => setActiveStore(store)}
                      >
                        {store}
                      </span>
                      {activeStore === store && 
                        <span className="input-group-text">
                          <img src="svg/blue-check-icon.svg" alt="" />
                        </span>
                      }
                    </div>
                  })}
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
