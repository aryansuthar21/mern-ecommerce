import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'

const AdminReviewPage = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)

  const { userInfo } = useSelector((state) => state.userLogin)

  const fetchReviews = async () => {
    try {
      setLoading(true)

      const { data } = await api.get('/reviews', {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      setReviews(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const approveReview = async (id) => {
    await api.patch(
      `/reviews/${id}/approve`,
      {},
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    )

    fetchReviews()
  }

  const deleteReview = async (id) => {
    await api.delete(`/reviews/${id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    })

    fetchReviews()
  }

  return (
    <div className="admin-review-page">
      <h2>Review Management</h2>

      {loading && <p>Loading...</p>}

      {reviews.map((review) => (
        <div
          key={review._id}
          style={{
            border: '1px solid #eee',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <p><strong>Product:</strong> {review.product?.name}</p>
          <p><strong>User:</strong> {review.user?.name}</p>
          <p><strong>Rating:</strong> {review.rating} ⭐</p>
          <p>{review.comment}</p>

          {review.images?.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {review.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="review"
                  style={{
                    width: '70px',
                    height: '70px',
                    objectFit: 'cover',
                    borderRadius: '5px',
                  }}
                />
              ))}
            </div>
          )}

          <p>
            Status:{' '}
            {review.isApproved ? (
              <span style={{ color: 'green' }}>Approved</span>
            ) : (
              <span style={{ color: 'orange' }}>Pending</span>
            )}
          </p>

          {!review.isApproved && (
            <button
              onClick={() => approveReview(review._id)}
              style={{
                marginRight: '10px',
                background: 'green',
                color: 'white',
                border: 'none',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Approve
            </button>
          )}

          <button
            onClick={() => deleteReview(review._id)}
            style={{
              background: 'red',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  )
}

export default AdminReviewPage