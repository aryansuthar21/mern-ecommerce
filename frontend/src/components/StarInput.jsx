import React, { useState } from 'react'

const StarInput = ({ value, onChange }) => {
  const [hover, setHover] = useState(0)
  const [active, setActive] = useState(null)

  const handleSelect = (star) => {
    onChange(star)
    setActive(star)

    // small click animation reset
    setTimeout(() => {
      setActive(null)
    }, 150)
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '8px',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'manipulation',
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star === active
        const isFilled = star <= (hover || value)

        return (
          <div
            key={star}
            style={{
              padding: '6px',              // Bigger tap area (important for mobile)
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleSelect(star)}
            onTouchStart={() => handleSelect(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <i
              className="fas fa-star"
              style={{
                fontSize: '26px',
                color: isFilled ? '#d4af37' : '#ddd',
                transition: 'all 0.2s ease',
                transform: isActive
                  ? 'scale(1.25)'
                  : isFilled
                  ? 'scale(1.1)'
                  : 'scale(1)',
              }}
            ></i>
          </div>
        )
      })}
    </div>
  )
}

export default StarInput