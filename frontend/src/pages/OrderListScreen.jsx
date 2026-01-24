import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { listOrders, deliverOrder } from '../store/orderActions'

const OrderListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const { success: successDeliver } = orderDeliver

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders())
    } else {
      navigate('/login')
    }
  }, [dispatch, navigate, userInfo, successDeliver])

  const deliverHandler = (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      dispatch(deliverOrder(id))
    }
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Orders</h1>

      {loading ? (
        <p className="page-message">Loading orders…</p>
      ) : error ? (
        <p className="page-error">{error}</p>
      ) : (
        <div className="admin-table-wrapper">
          <div className="admin-table-head">
            <span>Order</span>
            <span>User</span>
            <span>Date</span>
            <span>Total</span>
            <span>Paid</span>
            <span>Delivered</span>
            <span></span>
          </div>

          {orders.map((order) => (
            <div key={order._id} className="admin-table-row">
              <span className="order-id">
                #{order._id.slice(-6)}
              </span>
              <span>{order.user?.name}</span>
              <span>{order.createdAt.substring(0, 10)}</span>
              <span>₹{order.totalPrice}</span>

              <span
                className={`order-status ${
                  order.isPaid ? 'paid' : 'pending'
                }`}
              >
                {order.isPaid ? 'Paid' : 'Unpaid'}
              </span>

              <span>
                {order.isDelivered ? (
                  <span className="order-status paid">
                    Delivered
                  </span>
                ) : (
                  <button
                    onClick={() => deliverHandler(order._id)}
                    className="admin-action-btn"
                  >
                    Mark Delivered
                  </button>
                )}
              </span>

              <Link
                to={`/order/${order._id}`}
                className="admin-link"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrderListScreen
