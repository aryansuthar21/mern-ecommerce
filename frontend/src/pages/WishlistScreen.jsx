import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserWishlist, removeFromWishlist } from '../store/wishlistReducers'
import Message from '../components/Message'
import Loader from '../components/Loader'

const WishlistScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { userInfo } = useSelector((state) => state.userLogin)
  const { wishlist, loading, error } = useSelector((state) => state.wishlist)

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      dispatch(getUserWishlist())
    }
  }, [dispatch, userInfo, navigate])

  return (
    <div className="account-page">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">MY WISHLIST</h1>
        <hr className="short-underline" />
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : wishlist?.length === 0 ? (
        <div className="text-center">
          <Message variant="info">
            Your wishlist is empty. <Link to="/">Start shopping</Link>
          </Message>
        </div>
      ) : (
        <div className="product-grid">
          {wishlist?.map((item) => (
            <div key={item.product} className="product-item position-relative">
              <Link to={`/product/${item.product}`}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="img-fluid"
                  style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
                />
              </Link>
              
              <div className="mt-2 d-flex justify-content-between align-items-start">
                <div>
                   <Link to={`/product/${item.product}`} className="text-dark text-decoration-none fw-bold">
                     {item.name}
                   </Link>
                   <p className="text-muted small">${item.price}</p>
                </div>
                
                {/* Remove Button */}
                <button 
                   onClick={() => dispatch(removeFromWishlist(item.product))}
                   style={{
                     background: 'none',
                     border: 'none',
                     color: '#E50010',
                     fontSize: '1.2rem',
                     cursor: 'pointer'
                   }}
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default WishlistScreen