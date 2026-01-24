import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { saveShippingAddress } from '../store/cartActions'

const ShippingScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  // ✅ 1. ADDED: Phone Number State
  const [address, setAddress] = useState(shippingAddress?.address || '')
  const [city, setCity] = useState(shippingAddress?.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
  const [country, setCountry] = useState(shippingAddress?.country || '')
  const [phoneNumber, setPhoneNumber] = useState(shippingAddress?.phoneNumber || '') 

  const submitHandler = (e) => {
    e.preventDefault()

    // ✅ 2. ADDED: Include phoneNumber in the dispatch payload
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
        phoneNumber, 
      })
    )

    navigate('/payment')
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Shipping</h1>

      <form onSubmit={submitHandler} className="shipping-form">
        <div className="input-group">
          <label>Address</label>
          <input
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>City</label>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Postal Code</label>
          <input
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Country</label>
          <input
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>

        {/* ✅ 3. ADDED: Phone Number Input Field */}
        <div className="input-group">
          <label>Phone Number</label>
          <input
            required
            type="tel"
            placeholder="Required for order updates"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary checkout-btn">
          Continue
        </button>
      </form>
    </div>
  )
}

export default ShippingScreen