import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'


const HeroSlider = ({ slides, interval = 6000 }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [slides.length, interval])

  const slide = slides[current]

  return (
    <section className="hero-slider">
      <div className="hero-slide">
        {/* VIDEO */}
        {slide.video && (
          <video
            className="hero-media"
            src={slide.video}
            autoPlay
            muted
            loop
            playsInline
          />
        )}

        {/* IMAGE */}
        {slide.image && (
          <img
            className="hero-media"
            src={slide.image}
            alt={slide.title}
          />
        )}

        {/* OVERLAY */}
        <div className="hero-overlay">
  <motion.h1
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: 'easeOut' }}
  >
    {slide.title}
  </motion.h1>

  <motion.p
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.8 }}
  >
    {slide.subtitle}
  </motion.p>

  {slide.ctaText && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <Link to={slide.ctaLink} className="hero-btn">
        {slide.ctaText}
      </Link>
    </motion.div>
  )}
</div>

      </div>
    </section>
  )
}

export default HeroSlider
