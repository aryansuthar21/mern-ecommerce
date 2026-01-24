const express = require('express')
const asyncHandler = require('express-async-handler')
const crypto = require('crypto')
const { OAuth2Client } = require('google-auth-library')

const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')
const generateResetToken = require('../utils/generateResetToken')
const sendEmail = require('../utils/sendEmail')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// ==================================================
// 1. PUBLIC ROUTES (Login, Google, Password Reset)
// ==================================================

// @desc    Auth user & get token
// @route   POST /api/users/login
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      res.status(401)
      throw new Error('Invalid email or password')
    }

    if (!user.hasPassword && user.isGoogleUser) {
      res.status(400)
      throw new Error('This account uses Google Sign-In')
    }

    if (await user.matchPassword(password)) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        profilePic: user.profilePic,
        token: generateToken(user._id),
      })
    } else {
      res.status(401)
      throw new Error('Invalid email or password')
    }
  })
)

// @desc    Auth with Google
// @route   POST /api/users/google
router.post(
  '/google',
  asyncHandler(async (req, res) => {
    const { token } = req.body
    if (!token) {
      res.status(400)
      throw new Error('Google token missing')
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const { email, name, picture, email_verified } = ticket.getPayload()

    if (!email_verified) {
      res.status(400)
      throw new Error('Email not verified by Google')
    }

    let user = await User.findOne({ email })
    if (!user) {
      user = await User.create({
        name,
        email,
        password: 'google-auth',
        isGoogleUser: true,
        hasPassword: false,
        profilePic: picture,
      })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    })
  })
)

// @desc    Forgot password
// @route   POST /api/users/forgotpassword
router.post(
  '/forgotpassword',
  asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })

    if (!user) {
      res.status(404)
      throw new Error('User not found')
    }

    const { resetToken, hashedToken } = generateResetToken()
    user.resetPasswordToken = hashedToken
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      text: `Reset your password here:\n\n${resetUrl}`,
    })

    res.json({ message: 'Password reset email sent' })
  })
)

// @desc    Reset password
// @route   POST /api/users/resetpassword/:token
router.post(
  '/resetpassword/:token',
  asyncHandler(async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      res.status(400)
      throw new Error('Token invalid or expired')
    }

    user.password = req.body.password
    user.hasPassword = true
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ message: 'Password updated successfully' })
  })
)

// ==================================================
// 2. PROTECTED PROFILE ROUTES (Must be before /:id)
// ==================================================

// @desc    Get user profile / Update profile
// @route   GET/PUT /api/users/profile
router
  .route('/profile')
  .get(protect, asyncHandler(async (req, res) => {
    // Finding user by ID again ensures we have fresh data and avoids undefined properties
    const user = await User.findById(req.user._id)
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isGoogleUser: user.isGoogleUser,
        profilePic: user.profilePic,
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  }))
  .put(protect, asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = req.body.password
        user.hasPassword = true
      }

      const updatedUser = await user.save()
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        profilePic: updatedUser.profilePic,
        token: generateToken(updatedUser._id),
      })
    } else {
      res.status(404)
      throw new Error('User not found')
    }
  }))

// ==================================================
// 3. ADMIN & GENERAL ROUTES
// ==================================================

// @desc    Register user / Get all users (Admin only)
// @route   POST/GET /api/users
router
  .route('/')
  .post(asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    let user = await User.findOne({ email })

    if (user) {
      if (!user.hasPassword) {
        user.name = name || user.name
        user.password = password
        user.hasPassword = true
        await user.save()
        return res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        })
      }
      res.status(400)
      throw new Error('User already exists')
    }

    user = await User.create({ name, email, password, hasPassword: true, isGoogleUser: false })
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    })
  }))
  .get(protect, admin, asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password')
    res.json(users)
  }))

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
router.route('/:id').delete(protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }
  if (user.isAdmin) {
    res.status(400)
    throw new Error('Cannot delete admin user')
  }
  await User.deleteOne({ _id: user._id })
  res.json({ message: 'User removed' })
}))

module.exports = router