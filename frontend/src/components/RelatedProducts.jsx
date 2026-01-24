import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { listRelatedProducts } from '../store/productActions' // Import Action
import ProductCard from './ProductCard'
import Loader from './Loader'
import Message from './Message'

const RelatedProducts = ({ currentProductId }) => {
  const dispatch = useDispatch()

  const productRelated = useSelector((state) => state.productRelated)
  const { loading, error, products } = productRelated

  useEffect(() => {
    dispatch(listRelatedProducts(currentProductId))
  }, [dispatch, currentProductId])

  // Don't show section if no related items found
  if (!loading && products?.length === 0) return null

  return (
    <div className="mt-5">
      <h3 className="text-uppercase fw-bold mb-4" style={{ letterSpacing: '1px' }}>
        You May Also Like
      </h3>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-6 col-md-3 mb-4">
               {/* Reusing your existing Card Component */}
               <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RelatedProducts