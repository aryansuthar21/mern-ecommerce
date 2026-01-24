import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import ProductCard from '../components/ProductCard'
import { listProducts } from '../store/productActions'
import Hero from '../components/Hero'
import Loader from '../components/Loader'
import Message from '../components/Message'

const CategoryPage = () => {
  const { category: categorySlug } = useParams()
  const dispatch = useDispatch()

  const productList = useSelector((state) => state.productList)
  const { loading, error, products } = productList

  const banners = {
    men: {
      title: 'Men',
      subtitle: 'Essential styles for everyday wear',
      image: '/banners/men.jpg',
    },
    women: {
      title: 'Women',
      subtitle: 'New season silhouettes',
      image: '/banners/women.jpg',
    },
    accessories: {
      title: 'Accessories',
      subtitle: 'Details that define your look',
      image: '/banners/accessories.jpg',
    },
    new: {
      title: 'New Arrivals',
      subtitle: 'The latest trends, just landed',
      image: '/banners/new.jpg',
    }
  }

  // 🔥 Get hero data for the current section or use default
  const heroData = banners[categorySlug] || {
    title: categorySlug?.replace(/-/g, ' ').toUpperCase(),
    subtitle: 'Explore our latest collection',
    image: '/banners/default.jpg'
  }

  useEffect(() => {
    // 🔥 FIXED: Pass the category to the backend for recursive filtering
    if (categorySlug) {
      dispatch(listProducts(categorySlug))
    }
  }, [dispatch, categorySlug])

  return (
    <div className="category-page-wrapper">
      <Hero
        title={heroData.title}
        subtitle={heroData.subtitle}
        image={heroData.image}
        ctaText="Explore Collection"
        ctaLink={`/products?category=${categorySlug}`}
      />

      <Container>
        <div className="section-header mt-5 mb-4">
          <h1 className="page-title">
            {heroData.title}
          </h1>
        </div>

        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="product-list">
            {products && products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="text-center py-5">
                <Message variant="info">
                  No products found in this collection.
                </Message>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  )
}

export default CategoryPage