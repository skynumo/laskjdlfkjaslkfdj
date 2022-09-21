import React, { useEffect, useState } from 'react'

const Greeting = () => {

  const [hour, setHour] = useState()

  const getHour = () => {
    const date = new Date();
    const hour = date.getHours()
    setHour(hour);
  }

  useEffect(() => {
    getHour();
  }, [])
 
  return (
    <span className='greeting-box'>
      Hello! <br />
      {hour < 12 && "Good Morning"}
      {hour >= 12 && hour < 19 && "Good Afternoon"}
      {hour >= 19 && "Good Evening"},
    </span>
  )
}

export default Greeting;