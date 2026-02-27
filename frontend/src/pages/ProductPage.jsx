import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Form } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { listProductDetails } from '../store/productActions'
import HeartButton from '../components/HeartButton' 
import RelatedProducts from '../components/RelatedProducts'
import ReviewSection from '../components/ReviewSection'

const ProductPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [qty, setQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  useEffect(() => {
    dispatch(listProductDetails(id))
  }, [dispatch, id])

  // ✅ 1. DERIVE UNIQUE OPTIONS FROM VARIANTS
  // We use Set to get unique values (e.g. ['S', 'M', 'L']) from the variants list
  const uniqueSizes = [...new Set(product?.variants?.map((v) => v.size).filter(Boolean))]
  const uniqueColors = [...new Set(product?.variants?.map((v) => v.color).filter(Boolean))]

  // ✅ 2. FIND SPECIFIC VARIANT STOCK
  const selectedVariant = product?.variants?.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  )

  // Calculate maximum stock for the current selection
  // If nothing selected, use 0. If selected but not found, 0. If found, use variant stock.
  const currentStock = selectedVariant ? selectedVariant.countInStock : 0
  
  const addToCartHandler = () => {
    if (!selectedSize) {
      setErrorMsg('Please select a size')
      return
    }
    if (!selectedColor) {
      setErrorMsg('Please select a color')
      return
    }
    
    // Safety check for stock
    if (currentStock === 0) {
        setErrorMsg('This combination is out of stock')
        return
    }

    setErrorMsg('') 
    navigate(`/cart/${id}?qty=${qty}&size=${selectedSize}&color=${selectedColor}`)
  }

  return (
    <div className="product-page">
      {loading ? (
        <h4>Loading...</h4>
      ) : error ? (
        <h4 className="text-danger">{error}</h4>
      ) : (
        <>
          <Row className="product-layout">
            {/* IMAGE */}
            <Col md={6}>
              <div className="product-image-wrapper">
                <img
                  src={
                    product.image?.startsWith('http')
                      ? product.image
                      : `http://localhost:5000${product.image}`
                  }
                  alt={product.name}
                />
              </div>
            </Col>

            {/* INFO */}
            <Col md={6}>
              <div className="product-info-wrapper">
                
                {/* TITLE & HEART */}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h1 className="product-title m-0">{product.name}</h1>
                  <div style={{ transform: 'scale(1.5)', marginTop: '8px' }}>
                    <HeartButton productId={product._id} />
                  </div>
                </div>

                <p className="product-price">₹{product.price}</p>
                <p className="product-description">{product.description}</p>

                {/* ✅ SIZE SELECTOR */}
                {uniqueSizes.length > 0 && (
                  <div className="mb-4">
                    <span className="text-uppercase small fw-bold d-block mb-2" style={{ opacity: 0.8 }}>
                      Size: {selectedSize || 'Select'}
                    </span>
                    <div className="d-flex gap-2 flex-wrap">
                      {uniqueSizes.map((s) => (
                        <button
                          key={s}
                          className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                          onClick={() => { setSelectedSize(s); setQty(1); }} // Reset qty on change
                          style={{
                             color: selectedSize === s ? '#fff' : 'currentColor',
                             borderColor: 'currentColor',
                             backgroundColor: selectedSize === s ? 'currentColor' : 'transparent',
                          }}
                        >
                          <span style={{ filter: selectedSize === s ? 'invert(1)' : 'none' }}>
                            {s}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ COLOR SELECTOR */}
                {uniqueColors.length > 0 && (
                  <div className="mb-4">
                    <span className="text-uppercase small fw-bold d-block mb-2" style={{ opacity: 0.8 }}>
                      Color: {selectedColor || 'Select'}
                    </span>
                    <div className="d-flex gap-2 flex-wrap">
                      {uniqueColors.map((c) => (
                        <button
                          key={c}
                          className={`color-btn ${selectedColor === c ? 'active' : ''}`}
                          onClick={() => { setSelectedColor(c); setQty(1); }} // Reset qty on change
                          style={{ 
                            backgroundColor: c.toLowerCase(), 
                            border: selectedColor === c ? '2px solid currentColor' : '1px solid #777', 
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            padding: 0,
                            transform: selectedColor === c ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.2s ease',
                            boxShadow: selectedColor === c ? '0 0 10px rgba(0,0,0,0.2)' : 'none'
                          }}
                          title={c}
                          aria-label={`Select ${c}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* ✅ STOCK STATUS MESSAGE */}
                {selectedSize && selectedColor && (
                   <div className="mb-3">
                      {currentStock > 0 ? (
                        <span className="text-success small fw-bold">
                           <i className="fas fa-check-circle me-1"></i> In Stock ({currentStock} available)
                        </span>
                      ) : (
                        <span className="text-danger small fw-bold">
                           <i className="fas fa-times-circle me-1"></i> Out of Stock
                        </span>
                      )}
                   </div>
                )}

                {/* ✅ QUANTITY SELECTOR (Only if stock > 0) */}
                {currentStock > 0 && (
                  <div className="mb-4 d-flex align-items-center gap-3">
                     <span className="text-uppercase small fw-bold" style={{ opacity: 0.8 }}>Quantity:</span>
                     <Form.Select
                       value={qty}
                       onChange={(e) => setQty(Number(e.target.value))}
                       style={{ 
                         width: '80px', 
                         cursor: 'pointer',
                         backgroundColor: 'transparent',
                         color: 'inherit',
                         borderColor: 'currentColor'
                       }}
                     >
                       {[...Array(currentStock).keys()].map((x) => (
                         <option key={x + 1} value={x + 1} style={{ color: '#000' }}>{x + 1}</option>
                       ))}
                     </Form.Select>
                  </div>
                )}

                {/* Validation Error Message */}
                {errorMsg && <p className="text-danger fw-bold small mb-2">{errorMsg}</p>}

                {/* ✅ ADD TO CART BUTTON */}
                <Button
                  className="product-add-btn"
                  onClick={addToCartHandler}
                  // Disable if: Global stock is 0 OR (Both selected AND variant stock is 0)
                  disabled={product.countInStock === 0 || (selectedSize && selectedColor && currentStock === 0)}
                  style={{
                    opacity: (product.countInStock === 0 || (selectedSize && selectedColor && currentStock === 0)) ? 0.6 : 1
                  }}
                >
                  {product.countInStock === 0 
                    ? 'Sold Out' 
                    : (selectedSize && selectedColor && currentStock === 0) 
                        ? 'Out of Stock' 
                        : 'Add to Cart'
                  }
                </Button>
              </div>
            </Col>
          </Row>
          {/* REVIEWS SECTION */}
{product && (
  <div className="mt-5 border-top pt-5">
    <ReviewSection product={product} />
  </div>
)}
          {/* RELATED PRODUCTS */}
          <div className="mt-5 border-top pt-5" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
             <RelatedProducts currentProductId={id} />
          </div>
        </>
      )}
    </div>
  )
}

export default ProductPage