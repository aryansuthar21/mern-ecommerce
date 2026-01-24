import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import { createOrder } from '../store/orderActions'
import { ORDER_CREATE_RESET } from '../store/orderReducers'
import loadRazorpay from '../utils/loadRazorpay'

const PlaceOrderScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const cart = useSelector((state) => state.cart)
  const orderCreate = useSelector((state) => state.orderCreate)
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const { success, order, error } = orderCreate

  /* ================= PRICE CALCULATION ================= */
  const itemsPrice = Number(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  ).toFixed(2)

  const shippingPrice = itemsPrice > 1000 ? 0 : 50
  const taxPrice = Number(itemsPrice * 0.18).toFixed(2)

  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2)

  /* ================= REDIRECT ================= */
  useEffect(() => {
    if (success) {
      navigate(`/order/${order._id}`)
      dispatch({ type: ORDER_CREATE_RESET })
    }
  }, [success, navigate, order, dispatch])

  /* ================= COD ================= */
  const placeOrderHandler = () => {
    dispatch(
      createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      })
    )
  }

  /* ================= RAZORPAY ================= */
  const handleRazorpayPayment = async () => {
    const loaded = await loadRazorpay()
    if (!loaded) return alert('Razorpay SDK failed')

    const { data: razorOrder } = await axios.post(
      '/api/payment/create',
      { amount: totalPrice },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: razorOrder.currency,
      name: 'PROSHOP',
      description: 'Order Payment',
      order_id: razorOrder.id,

      handler: async (response) => {
        const verifyRes = await axios.post('/api/payment/verify', response)

        if (verifyRes.data.success) {
          dispatch(
            createOrder({
              orderItems: cart.cartItems,
              shippingAddress: cart.shippingAddress,
              paymentMethod: 'Razorpay',
              itemsPrice,
              shippingPrice,
              taxPrice,
              totalPrice,
              isPaid: true,
              paidAt: Date.now(),
              paymentResult: {
                id: response.razorpay_payment_id,
                status: 'success',
              },
            })
          )
        } else {
          alert('Payment verification failed')
        }
      },
      theme: { color: '#000' },
    }

    new window.Razorpay(options).open()
  }

  /* ================= UI ================= */
  return (
    <div className="checkout-page wide">
      <h1 className="checkout-title">Place Order</h1>

      <div className="checkout-layout">
        {/* LEFT */}
        <div className="checkout-info">
          <div className="checkout-section">
            <h3>Shipping</h3>
            <p>
              {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
              {cart.shippingAddress.postalCode},{' '}
              {cart.shippingAddress.country}
            </p>
          </div>

          <div className="checkout-section">
            <h3>Payment</h3>
            <p>{cart.paymentMethod}</p>
          </div>

          <div className="checkout-section">
            <h3>Items</h3>
            {cart.cartItems.map((item) => (
              <div key={item.product} className="checkout-item">
                <span>{item.name}</span>
                <span>
                  {item.qty} × ₹{item.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="order-summary">
          <h3>Order Summary</h3>

          <div className="summary-line">
            <span>Items</span>
            <span>₹{itemsPrice}</span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span>₹{shippingPrice}</span>
          </div>
          <div className="summary-line">
            <span>Tax</span>
            <span>₹{taxPrice}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          {error && <p className="page-error">{error}</p>}

          {cart.paymentMethod === 'COD' ? (
            <button
              className="btn-primary checkout-btn"
              onClick={placeOrderHandler}
            >
              Place Order
            </button>
          ) : (
            <button
              className="btn-primary checkout-btn"
              onClick={handleRazorpayPayment}
            >
              Pay ₹{totalPrice}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PlaceOrderScreen
