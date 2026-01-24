const express = require('express')
const crypto = require('crypto')
const Razorpay = require('razorpay')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

// 🔹 Create Razorpay Order
router.post('/create', protect, async (req, res) => {
  try {
    const options = {
      amount: Math.round(req.body.amount * 100), // INR → paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    }

    const order = await razorpay.orders.create(options)
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// 🔹 Verify Payment Signature
router.post('/verify', protect, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body

  const body = razorpay_order_id + '|' + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex')

  if (expectedSignature === razorpay_signature) {
    res.json({
      success: true,
      paymentId: razorpay_payment_id,
    })
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' })
  }
})

module.exports = router
