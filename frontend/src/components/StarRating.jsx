import React from 'react'

const StarRating = ({ value = 0, size = 18 }) => {
  const stars = []

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(
        <i
          key={i}
          className="fas fa-star"
          style={{ color: '#d4af37', fontSize: size }}
        ></i>
      )
    } else if (value >= i - 0.5) {
      stars.push(
        <i
          key={i}
          className="fas fa-star-half-alt"
          style={{ color: '#d4af37', fontSize: size }}
        ></i>
      )
    } else {
      stars.push(
        <i
          key={i}
          className="far fa-star"
          style={{ color: '#d4af37', fontSize: size }}
        ></i>
      )
    }
  }

  return <div style={{ display: 'flex', gap: '4px' }}>{stars}</div>
}

export default StarRating