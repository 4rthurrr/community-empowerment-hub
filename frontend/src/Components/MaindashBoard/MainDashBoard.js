import React from 'react'
import { useNavigate } from 'react-router-dom'

function MainDashBoard() {
  const navigate = useNavigate();

  const handleSellerClick = () => {
    navigate('/seller');
  }

  return (
    <div>
        <>
        <h2>Dashboard</h2>
        <p>Welcome to the dashboard</p>
        <button type='button' onClick={handleSellerClick}>seller</button>
        <button type='submit'>customer</button>
        
        </>
    </div>
  )
}

export default MainDashBoard