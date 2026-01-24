import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { savePaymentMethod } from '../store/cartActions'

const PaymentScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)
  const { shippingAddress, paymentMethod: savedMethod } = cart

  if (!shippingAddress?.address) {
    navigate('/shipping')
  }

  const [paymentMethod, setPaymentMethod] = useState(
    savedMethod || 'COD'
  )

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(savePaymentMethod(paymentMethod))
    navigate('/placeorder')
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">Payment</h1>

      <form onSubmit={submitHandler} className="payment-form">
        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === 'COD'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>
            Cash on Delivery
            <small>Pay when your order arrives</small>
          </span>
        </label>

        <label className="payment-option">
          <input
            type="radio"
            name="paymentMethod"
            value="Razorpay"
            checked={paymentMethod === 'Razorpay'}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>
            Online Payment
            <small>UPI, Cards, Net Banking</small>
          </span>
        </label>

        <button type="submit" className="btn-primary checkout-btn">
          Continue
        </button>
      </form>
    </div>
  )
}

export default PaymentScreen
