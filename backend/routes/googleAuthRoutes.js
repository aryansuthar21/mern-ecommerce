const express = require('express')
const axios = require('axios')
const User = require('../models/userModel')
const generateToken = require('../utils/generateToken')

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { token } = req.body

    // 🔐 Verify Google token
    const googleRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`
    )

    const { email, name, picture, sub } = googleRes.data

    if (!email) {
      return res.status(400).json({ message: 'Google email not found' })
    }

    // 🔍 Check existing user
    let user = await User.findOne({ email })

    // 🆕 If user does NOT exist → create NORMAL USER
    if (!user) {
      user = await User.create({
        name,
        email,
        password: sub,        // dummy password
        isAdmin: false,       // ✅ auto role = user
        isGoogleUser: true,
        profilePic: picture,
      })
    }

    // ✅ Send same response as normal login
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error(error)
    res.status(401).json({ message: 'Google authentication failed' })
  }
})

module.exports = router
