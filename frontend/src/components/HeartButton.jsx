import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToWishlist, removeFromWishlist } from '../store/wishlistReducers'

const HeartButton = ({ productId }) => {
  const dispatch = useDispatch()
  
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const wishlistState = useSelector((state) => state.wishlist)
  const { wishlist } = wishlistState

  // Check if product is already in wishlist
  const isWishlisted = wishlist?.find((item) => item.product === productId)

  const toggleWishlist = (e) => {
    e.preventDefault() // Stop clicking the product card itself
    e.stopPropagation()

    if (!userInfo) {
      alert('Please sign in to save items to your wishlist')
      return
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(productId))
    } else {
      dispatch(addToWishlist(productId))
    }
  }

  return (
    <button 
      onClick={toggleWishlist}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '5px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // ✅ DARK MODE FIX: Forces button to use parent text color
        // (White in Dark Mode, Black in Light Mode)
        color: 'inherit', 
        transition: 'transform 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <svg 
        width="22" 
        height="22" 
        viewBox="0 0 24 24" 
        // If Active: Red Fill. If Inactive: Transparent Fill
        fill={isWishlisted ? "#E50010" : "none"} 
        // If Active: Red Border. If Inactive: 'currentColor' (Inherits White/Black)
        stroke={isWishlisted ? "#E50010" : "currentColor"} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ 
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy pop effect
          filter: isWishlisted ? 'drop-shadow(0 2px 4px rgba(229, 0, 16, 0.3))' : 'none'
        }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  )
}

export default HeartButton