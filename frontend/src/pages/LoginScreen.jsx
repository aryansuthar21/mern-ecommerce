import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login, googleLogin } from '../store/userActions'
import { GoogleLogin } from '@react-oauth/google'

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  // ================= REDIRECT =================
  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])

  // ================= EMAIL LOGIN =================
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  // ================= GOOGLE LOGIN =================
  const googleSuccessHandler = (credentialResponse) => {
    if (!credentialResponse?.credential) {
      alert('Google authentication failed')
      return
    }

    dispatch(googleLogin(credentialResponse.credential))
  }

  const googleErrorHandler = () => {
    alert('Google Sign In was unsuccessful. Try again.')
  }

  return (
    <section className="auth-page">
      <div className="auth-box">
        <h1 className="auth-title">Sign In</h1>

        {error && <div className="auth-error">{error}</div>}
        {loading && <div className="auth-loading">Signing in...</div>}

        {/* ================= EMAIL LOGIN ================= */}
        <form onSubmit={submitHandler} className="auth-form">
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

          <p className="auth-switch">
  <Link to="/forgot-password">Forgot your password?</Link>
</p>


          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            Sign In
          </button>
        </form>

        {/* ================= DIVIDER ================= */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* ================= GOOGLE LOGIN ================= */}
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={googleSuccessHandler}
            onError={googleErrorHandler}
          />
        </div>

        <p className="auth-switch">
          New customer? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginScreen
