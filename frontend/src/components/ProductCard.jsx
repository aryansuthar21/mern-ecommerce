import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeartButton from './HeartButton' // ✅ 1. Import

const ProductCard = ({ product }) => {
  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-0 product-card">
        
        {/* IMAGE WRAPPER */}
        <div className="product-img-wrapper" style={{ position: 'relative' }}>
          
          {/* ❤️ 2. HEART BUTTON (Absolute Positioned) */}
          <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 10 }}>
            <HeartButton productId={product._id} />
          </div>

          {/* Link wraps only the image now */}
          <Link to={`/product/${product._id}`} className="text-decoration-none">
            <img
              src={
                product.image?.startsWith('http')
                  ? product.image
                  : `http://localhost:5000${product.image}`
              }
              alt={product.name}
              className="card-img-top" 
            />
            <div className="product-quick-view">Quick View</div>
          </Link>
        </div>

        {/* INFO */}
        <Card.Body className="px-0 product-info">
          <Link to={`/product/${product._id}`} className="text-decoration-none">
            <Card.Text className="product-name">
              {product.name}
            </Card.Text>
          </Link>
          <Card.Text className="product-price">
            ₹{product.price}
          </Card.Text>
        </Card.Body>

      </Card>
    </motion.div>
  )
}

export default ProductCard