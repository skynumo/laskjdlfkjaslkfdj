import React, { useState } from 'react'
import { Loader } from './Loader'

export const Modal = (props) => {

  const [showLoader, setShowLoader] = useState(false)

  const onConfirm = () => {
    setShowLoader(true)
    props.onConfirm && props.onConfirm();
    setTimeout(() => {
      setShowLoader(false)
    }, 5000);
  }

  const onClose = () => {
    props.onClose && props.onClose();
  }

  return (
    <React.Fragment>
      <div className='app-modal-ui'>
        <div className="modal fade show">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h5 className="modal-title"> {props.title}</h5>
                {props.showCloseIcon && <button onClick={() => onClose()} type="button" className="close">
                  <span>&times;</span>
                </button>
                }
              </div>
              <div className="modal-body text-muted">
                <p>{props.content}</p>
              </div>
              <div className="modal-footer">
                <button onClick={() => onClose()} type="button" className="btn btn-light">{props.closeBtnLabel ?? 'Cancel'}</button>
                <button onClick={() => onConfirm()} 
                  type="button" 
                  className="btn btn-primary"
                  disabled= {showLoader}
                >
                  {props.confirmBtnLabel ?? 'Ok'}
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
