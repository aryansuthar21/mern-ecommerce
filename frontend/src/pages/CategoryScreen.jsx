import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

import { listProducts } from '../store/productActions'
import ProductCard from '../components/ProductCard'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FilterSidebar from '../components/FilterSidebar' // ✅ Import Filter Sidebar

const CategoryScreen = () => {
  const dispatch = useDispatch()
  const location = useLocation()

  // 1. FILTER STATE
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    sort: 'newest',
    minPrice: '',
    maxPrice: ''
  })

  // 2. READ PARAMS
  const query = new URLSearchParams(location.search)
  const categorySlug = query.get('category')
  const keyword = query.get('keyword')

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  useEffect(() => {
    // ✅ Pass 'filters' as the 3rd argument
    dispatch(listProducts(categorySlug || '', keyword || '', filters))
  }, [dispatch, categorySlug, keyword, filters])

  // Helper for Title Logic
  const getTitle = () => {
    if (keyword) return `SEARCH RESULTS FOR "${keyword.toUpperCase()}"`
    if (categorySlug) return categorySlug.replace(/-/g, ' ').toUpperCase()
    return 'COLLECTION'
  }

  return (
    <section className="product-page">
      <div className="category-header text-center mb-5">
        <h1 className="display-4 fw-bold">{getTitle()}</h1>
        <hr className="short-underline" />

        {/* ✅ MOBILE FILTER TRIGGER BUTTON (Visible only on mobile) */}
        <button 
          className="d-block d-md-none mx-auto mt-3 btn btn-outline-dark text-uppercase fw-bold"
          onClick={() => setMobileFilterOpen(true)}
        >
          Filter & Sort
        </button>
      </div>

      <div className="container-fluid" style={{ maxWidth: '1600px' }}>
        <div className="d-flex">
          
          {/* ✅ SIDEBAR (Desktop: Sticky Left | Mobile: Drawer) */}
          <FilterSidebar 
            filters={filters} 
            setFilters={setFilters}
            isOpen={mobileFilterOpen}
            onClose={() => setMobileFilterOpen(false)}
          />

          {/* ✅ PRODUCT GRID (Takes remaining width) */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <Loader />
            ) : error ? (
              <Message variant="danger">{error}</Message>
            ) : products.length === 0 ? (
              <div className="no-products-container text-center">
                 <Message variant="info">
                   {keyword 
                     ? `We couldn't find any matches for "${keyword}". Try checking your spelling or use more general terms.`
                     : "No products found."}
                 </Message>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-item">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CategoryScreen