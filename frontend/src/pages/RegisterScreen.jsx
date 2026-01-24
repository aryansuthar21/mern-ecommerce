import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const RegisterScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      }

      const { data } = await axios.post(
        '/api/users',
        { name, email, password },
        config
      )

      localStorage.setItem('userInfo', JSON.stringify(data))
      setLoading(false)
      navigate('/')
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      )
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-box">
        <h1 className="auth-title">Create Account</h1>

        {message && <div className="auth-error">{message}</div>}
        {error && <div className="auth-error">{error}</div>}
        {loading && <div className="auth-loading">Registering...</div>}

        <form onSubmit={submitHandler} className="auth-form">
          <div className="auth-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            Register
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterScreen
