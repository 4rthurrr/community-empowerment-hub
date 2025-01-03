import React from 'react'
import { useNavigate } from 'react-router-dom'

function SellerDashboard() {

    const navigate = useNavigate();

    const handelBackClick = () => {
      navigate('/');
    }

    const handelAdditems = () => {
        navigate('/additems');
      }


  return (
    <div>
        <h1>Seller Dashboard</h1>
        <p>Welcome to the dachboard</p>
        <p>Edit your gig</p>
        <button type='button' onClick={handelAdditems}>Add Items</button>

        <button type='button' onClick={handelBackClick}>Back</button>
    </div>
  )
}

export default SellerDashboard