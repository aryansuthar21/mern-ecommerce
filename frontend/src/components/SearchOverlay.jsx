import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const SearchOverlay = ({ isOpen, onClose }) => {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      // Redirect to the listing page with the keyword
      navigate(`/products?keyword=${keyword.trim()}`)
      setKeyword('')
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. Dark Backdrop */}
          <motion.div 
            className="search-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 2. White Search Drawer */}
          <motion.div 
            className="search-drawer"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="search-container">
              <form onSubmit={submitHandler} className="search-form">
                <button type="submit" className="search-icon-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </button>
                
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="search-input"
                />

                <button type="button" className="search-close-btn" onClick={onClose}>
                  ✕
                </button>
              </form>
              
              <div className="search-hints">
                <span>Trending:</span>
                <button onClick={() => { setKeyword('Summer'); submitHandler({ preventDefault: () => {} }); }}>Summer</button>
                <button onClick={() => { setKeyword('Jeans'); submitHandler({ preventDefault: () => {} }); }}>Jeans</button>
                <button onClick={() => { setKeyword('Shoes'); submitHandler({ preventDefault: () => {} }); }}>Shoes</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SearchOverlay