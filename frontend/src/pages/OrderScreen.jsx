import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getOrderDetails } from '../store/orderActions'

const OrderScreen = () => {
  const { id: orderId } = useParams()
  const dispatch = useDispatch()

  const orderDetails = useSelector((state) => state.orderDetails)
  const { loading, error, order } = orderDetails

  useEffect(() => {
    dispatch(getOrderDetails(orderId))
  }, [dispatch, orderId])

  if (loading) return <p className="page-message">Loading order…</p>
  if (error) return <p className="page-error">{error}</p>
  if (!order) return null

  return (
    <div className="checkout-page wide">
      <h1 className="checkout-title">Order #{order._id.slice(-6)}</h1>

      <div className="checkout-layout">
        {/* LEFT */}
        <div className="checkout-info">
          <div className="checkout-section">
            <h3>Shipping</h3>
            <p>
              {order.shippingAddress.address},{' '}
              {order.shippingAddress.city},{' '}
              {order.shippingAddress.postalCode},{' '}
              {order.shippingAddress.country}
            </p>
            <p
              className={`order-status ${
                order.isDelivered ? 'paid' : 'pending'
              }`}
            >
              {order.isDelivered ? 'Delivered' : 'Not Delivered'}
            </p>
          </div>

          <div className="checkout-section">
            <h3>Payment</h3>
            <p>Method: {order.paymentMethod}</p>
            <p
              className={`order-status ${
                order.isPaid ? 'paid' : 'pending'
              }`}
            >
              {order.isPaid ? 'Paid' : 'Not Paid'}
            </p>
          </div>

          <div className="checkout-section">
            <h3>Items</h3>
            {order.orderItems.map((item) => (
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
            <span>₹{order.itemsPrice}</span>
          </div>
          <div className="summary-line">
            <span>Shipping</span>
            <span>₹{order.shippingPrice}</span>
          </div>
          <div className="summary-line">
            <span>Tax</span>
            <span>₹{order.taxPrice}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderScreen
