import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
 
export const AddToCartFailedModal = ({message, onClose}) => {
  return (
    <React.Fragment>
      <div className='app-modal-ui cart-success-modal'>
        <div className="modal fade show">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-center py-0">
                <h5 className="modal-title">{message}</h5>
              </div>
              <div className="modal-footer d-block">
                 <button onClick={() => onClose()} type="button" className="btn btn-primary">Ok</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}