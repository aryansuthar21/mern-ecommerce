import React, { useState } from 'react'
import axios from 'axios'

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    try {
      const { data } = await axios.post('/api/users/forgotpassword', {
        email,
      })

      setMessage(data.message || 'Reset link sent to your email')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-box">
        <h1 className="auth-title">Forgot Password</h1>

        <p className="auth-subtitle">
          Enter your email and we’ll send you a reset link.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success">{message}</div>}

        <form onSubmit={submitHandler} className="auth-form">
          <div className="auth-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </section>
  )
}

export default ForgotPasswordScreen
