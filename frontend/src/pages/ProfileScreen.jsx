import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails, updateProfile } from '../store/userActions'
import Loader from '../components/Loader'
import Message from '../components/Message'

const ProfileScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userDetails = useSelector((state) => state.userDetails)
  const { loading, error, user } = userDetails

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile)
  const { success } = userUpdateProfile

  useEffect(() => {
    if (!userInfo) {
      navigate('/login')
    } else {
      // ✅ FIX: Added safety check to ensure 'user' exists before accessing properties
      if (!user || !user.name || success || user._id !== userInfo._id) {
        dispatch(getUserDetails('profile'))
      } else {
        setName(user.name)
        setEmail(user.email)
      }
    }

    if (success) {
      setMessage('Profile updated successfully')
      setTimeout(() => setMessage(null), 3000)
    }
  }, [dispatch, navigate, userInfo, user, success])

  const submitHandler = (e) => {
    e.preventDefault()
    setMessage(null)

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      return
    }

    dispatch(updateProfile({ id: user._id, name, email, password }))
    setPassword('')
    setConfirmPassword('')
  }

  return (
    <section className="profile-page">
      <div className="profile-wrapper">
        <h1 className="profile-title">My Account</h1>

        {message && <div className="profile-success">{message}</div>}
        {error && <div className="profile-error">{error}</div>}
        
        {/* ✅ FIX: Wrap form in a loading check to prevent rendering undefined values */}
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={submitHandler} className="profile-form">
            <div className="profile-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="profile-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="profile-group">
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="profile-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="profile-btn" disabled={loading}>
              Update Profile
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default ProfileScreen