import React from 'react'

export const Loader = (props) => {
  if(!props.type) {
    return (
      <div className="loading-spinner"></div>
    )
  } else {
    return (
      <div className="inline-loader"></div>
    )
  }
}
