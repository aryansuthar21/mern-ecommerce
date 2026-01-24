import React from 'react'

const Hero = ({ title, subtitle, image, video, ctaText, ctaLink }) => {
  return (
    <section className="hero">
      {/* Video (optional) */}
      {video ? (
        <video
          className="hero-video"
          src={video}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div
          className="hero-image"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}

      {/* Overlay */}
      <div className="hero-overlay">
        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}

        {ctaText && ctaLink && (
          <a href={ctaLink} className="hero-cta">
            {ctaText}
          </a>
        )}
      </div>
    </section>
  )
}

export default Hero
