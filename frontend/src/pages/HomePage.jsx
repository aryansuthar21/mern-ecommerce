import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'

import { listProducts } from '../store/productActions'
import ProductCard from '../components/ProductCard'
import HeroSlider from '../components/HeroSlider'

// HERO ASSETS
import heroVideo from '../assets/banners/hero.mp4'
import menBanner from '../assets/banners/men.jpeg'
import accessoriesBanner from '../assets/banners/accessories.jpg'

// HERO SLIDES
const heroSlides = [
  {
    title: 'Designed for Movement',
    subtitle: 'Modern silhouettes. Premium comfort.',
    video: heroVideo,
    ctaText: 'Shop Women',
    ctaLink: '/category/women',
  },
  {
    title: 'New Season Arrivals',
    subtitle: 'Minimal styles for everyday wear',
    image: menBanner,
    ctaText: 'Shop Men',
    ctaLink: '/category/men',
  },
  {
    title: 'Accessories That Define You',
    subtitle: 'Details that complete your look',
    image: accessoriesBanner,
    ctaText: 'Explore Accessories',
    ctaLink: '/category/accessories',
  },
]

const HomePage = () => {
  const dispatch = useDispatch()
  const { category } = useParams() // slug like men, women, accessories

  const productList = useSelector((state) => state.productList)
  const { loading, error, products = [] } = productList

  // ✅ Fetch products from PUBLIC API with category filter
  useEffect(() => {
    dispatch(listProducts('', category || ''))
  }, [dispatch, category])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [category])

  return (
    <main>
      {/* HERO SLIDER (HOME ONLY) */}
      {!category && <HeroSlider slides={heroSlides} interval={13000} />}

      {/* CATEGORY HERO */}
      {category && (
        <section className="category-hero">
          <div className="category-overlay">
            <h1>{category.toUpperCase()} Collection</h1>
            <p>Curated essentials designed for everyday wear</p>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <Container>
        {!category && (
          <div className="section-header">
            <h2>Latest Collection</h2>
            <p>Handpicked styles for this season</p>
          </div>
        )}

        {loading && <p className="page-message">Loading products...</p>}
        {error && <p className="page-error">{error}</p>}

        {!loading && !error && (
          <motion.div
            className={`product-list ${category ? 'category-grid' : ''}`}
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <motion.div
                  key={product._id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <p className="page-message">No products found</p>
            )}
          </motion.div>
        )}
      </Container>
    </main>
  )
}

export default HomePage
