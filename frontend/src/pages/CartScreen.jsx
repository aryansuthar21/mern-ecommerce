import React, { useEffect } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../store/cartActions'

const CartScreen = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // 1. Parse all parameters (Qty, Size, Color)
  const query = new URLSearchParams(location.search)
  const qty = query.get('qty') ? Number(query.get('qty')) : 1
  const size = query.get('size')
  const color = query.get('color')

  const cart = useSelector((state) => state.cart)
  const { cartItems } = cart

  // ✅ NEW: Get User Login Status
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  useEffect(() => {
    if (id) {
      // 2. Add with variants
      dispatch(addToCart(id, qty, size, color))
    }
  }, [dispatch, id, qty, size, color])

  // 3. Update Remove Handler to accept variants
  const removeFromCartHandler = (id, size, color) => {
    dispatch(removeFromCart(id, size, color))
  }

  // ✅ FIXED CHECKOUT HANDLER
  const checkoutHandler = () => {
    if (userInfo) {
      // If user is already logged in, go straight to shipping
      navigate('/shipping')
    } else {
      // If not logged in, go to login first
      navigate('/login?redirect=/shipping')
    }
  }

  const itemsPrice = cartItems
    .reduce((acc, item) => acc + item.price * item.qty, 0)
    .toFixed(2)

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0)

  return (
    <section className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          Your cart is empty. <Link to="/">Continue shopping</Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* LEFT: ITEMS */}
          <div className="cart-items">
            {cartItems.map((item) => (
              // Unique Key for variants
              <div key={`${item.product}-${item.size}-${item.color}`} className="cart-row">
                <Link to={`/product/${item.product}`} className="cart-image">
                  <img
                    src={
                      item.image?.startsWith('http')
                        ? item.image
                        : `http://localhost:5000${item.image}`
                    }
                    alt={item.name}
                  />
                </Link>

                <div className="cart-details">
                  <Link to={`/product/${item.product}`} className="cart-name">
                    {item.name}
                  </Link>
                  
                  {/* Display Variants */}
                  <div className="cart-variants" style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                     {item.size && <span>Size: <strong>{item.size}</strong></span>}
                     {item.size && item.color && <span style={{ margin: '0 8px' }}>|</span>}
                     {item.color && <span>Color: <strong>{item.color}</strong></span>}
                  </div>

                  <span className="cart-price">₹{item.price}</span>
                </div>

                <div className="cart-qty">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      // Pass size/color back when changing Qty
                      dispatch(addToCart(item.product, Number(e.target.value), item.size, item.color))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="cart-remove"
                  // Pass specific variants to remove
                  onClick={() => removeFromCartHandler(item.product, item.size, item.color)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY */}
          <aside className="cart-summary">
            <h2>Summary</h2>
            <div className="cart-summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>
            <div className="cart-summary-row">
              <span>Total</span>
              <span>₹{itemsPrice}</span>
            </div>

            <button
              className="cart-checkout"
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  )
}

export default CartScreen