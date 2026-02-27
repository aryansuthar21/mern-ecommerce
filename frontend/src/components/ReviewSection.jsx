import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import '../styles/review.css'

const ReviewSection = ({ product }) => {
  const [reviews, setReviews] = useState([])
  const [showAll, setShowAll] = useState(false)
  const [rating, setRating] = useState('')
  const [hoverRating, setHoverRating] = useState(null)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedReview, setSelectedReview] = useState(null)

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // Fetch reviews
  const fetchReviews = async () => {
    const { data } = await axios.get(`/api/reviews/${product._id}`)
    setReviews(data)
  }

  useEffect(() => {
    if (product?._id) {
      fetchReviews()
    }
  }, [product])

  // Upload images
  const uploadImages = async (files) => {
    const formData = new FormData()

    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i])
    }

    try {
      setUploading(true)

      const { data } = await axios.post(
        '/api/review-upload',
        formData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      )

      setImages(data)
    } catch (err) {
      setError('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  // Submit review
  const submitHandler = async (e) => {
    e.preventDefault()

    if (!rating) {
      setError('Please select a rating')
      return
    }

    try {
      setLoading(true)

      const { data } = await axios.post(
        `/api/reviews/${product._id}`,
        { rating: Number(rating), comment, images },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      )

      setReviews([data, ...reviews])
      setRating('')
      setComment('')
      setImages([])

    } catch (err) {
      setError(err.response?.data?.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  const userReview = reviews.find(
    (r) => r.user === userInfo?._id
  )

  // 🔥 Show only 1 review unless expanded
  const visibleReviews = showAll ? reviews : reviews.slice(0, 1)

  return (
    <div className="review-section">
      <h2>Customer Reviews</h2>

      {/* Review List */}
      <div className={`review-list ${showAll ? 'expanded' : ''}`}>
        {visibleReviews.map((review) => (
          <div
            key={review._id}
            className="review-card"
            onClick={() => setSelectedReview(review)}
          >
            <div className="review-header">
              <strong>{review.name}</strong>
              <span>{review.rating} ⭐</span>
            </div>

            {review.user === userInfo?._id && !review.isApproved && (
              <small style={{ color: 'orange' }}>
                Pending Approval
              </small>
            )}

            <p>
              {review.comment.length > 120
                ? review.comment.substring(0, 120) + '...'
                : review.comment}
            </p>

            {review.images?.length > 0 && (
              <div className="review-images">
                {review.images.map((img, index) => (
                  <img key={index} src={img} alt="review" />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* SEE ALL BUTTON */}
      {reviews.length > 1 && (
        <div className="review-toggle">
          <button onClick={() => setShowAll(!showAll)}>
            {showAll
              ? 'Hide Reviews'
              : `See All Reviews (${reviews.length})`}
          </button>
        </div>
      )}

      {/* Thank You */}
      {userReview && (
        <p className="thank-you">
          ✅ Thank you for your feedback
        </p>
      )}

      {/* Review Form */}
      {userInfo && !userReview && (
        <div className="review-form">
          <h3>Write a Review</h3>

          {error && <p className="error">{error}</p>}

          <form onSubmit={submitHandler}>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  style={{
                    color:
                      star <= (hoverRating || rating)
                        ? '#ffc107'
                        : '#ccc',
                  }}
                >
                  ★
                </span>
              ))}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => uploadImages(e.target.files)}
            />

            <textarea
              placeholder="Write your review"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Modal */}
      {selectedReview && (
        <div
          className="review-modal-overlay"
          onClick={() => setSelectedReview(null)}
        >
          <div
            className="review-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{selectedReview.name}</h3>
            <p>{selectedReview.rating} ⭐</p>
            <p>{selectedReview.comment}</p>

            {selectedReview.images?.map((img, index) => (
              <img key={index} src={img} alt="review" />
            ))}

            <button onClick={() => setSelectedReview(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReviewSection