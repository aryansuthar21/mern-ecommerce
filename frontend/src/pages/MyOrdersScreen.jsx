import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { listMyOrders } from '../store/orderActions'

const MyOrdersScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userInfo } = useSelector((state) => state.userLogin)

  const orderListMy = useSelector((state) => state.orderListMy)
  const { loading, error, orders = [] } = orderListMy

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      dispatch(listMyOrders())
    }
  }, [dispatch, navigate, userInfo])

  return (
    <div className="zara-page">
      <h1 className="zara-title">My Orders</h1>

      {loading && <p className="zara-message">Loading orders…</p>}
      {error && <p className="zara-error">{error}</p>}

      {!loading && orders.length === 0 && (
        <p className="zara-message">You haven’t placed any orders yet.</p>
      )}

      <div className="zara-orders">
        {orders.map((order) => (
          <div key={order._id} className="zara-order-card">
            <div className="order-left">
              <p className="order-id">
                Order #{order._id.slice(-6)}
              </p>
              <p className="order-date">
                {order.createdAt.substring(0, 10)}
              </p>
            </div>

            <div className="order-center">
              <p className="order-price">₹{order.totalPrice}</p>
              <span
                className={`order-status ${
                  order.isPaid ? 'paid' : 'pending'
                }`}
              >
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>

            <div className="order-right">
              <Link
                to={`/order/${order._id}`}
                className="zara-link"
              >
                View details →
              </Link>

              {/* 🚚 Track Order Link */}
              {order.shiprocketShipmentId && (
                <a
  href={`https://shiprocket.co/tracking/${order.shiprocketShipmentId}`}
  target="_blank"
  rel="noopener noreferrer"
  className="zara-track-link"
>
  🚚 Track →
</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyOrdersScreen