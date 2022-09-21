import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
 
export const AddToCartSuccessModal = () => {
  return (
    <React.Fragment>
      <div className='app-modal-ui cart-success-modal'>
        <div className="modal fade show">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-img">
                <Image src="/single-product/AddedBlue@2x.png" alt="" height={100} width={100} />
              </div>
              <div className="modal-header text-center py-0">
                <h5 className="modal-title">Product has been added to cart</h5>
              </div>
              <div className="modal-footer d-block">
                <Link href="/home"><button type="button" className="btn btn-outline-secondary w-100">Continue Shopping</button></Link>
                <Link href="/cart"><button type="button" className="btn btn-primary w-100">View Cart</button></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}