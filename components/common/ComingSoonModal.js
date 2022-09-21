import React from 'react'

export const ComingSoonModal = (props) => {

  const onClose = () => {
    props.onClose && props.onClose();
  }

  return (
    <React.Fragment>
      <div className='app-modal-ui full-width'>
        <div className="modal fade show">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header text-center">
                <h5 className="modal-title">Newness</h5>
                {props.showCloseIcon && <button onClick={() => onClose()} type="button" className="close">
                  <span>&times;</span>
                </button>
                }
              </div>
              <div className="modal-body text-muted">
                <p>Something new is on it&apos;s way</p>
              </div>
              <div className="modal-footer">
                <button onClick={() => onClose()} type="button" className="btn btn-light">Ok</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
