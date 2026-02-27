const express = require('express')
const asyncHandler = require('express-async-handler')
const Review = require('../models/reviewModel')
const Product = require('../models/productModel')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

// ==================================================
// GET APPROVED REVIEWS FOR PRODUCT
// ==================================================
router.get(
  '/:productId',
  asyncHandler(async (req, res) => {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true,
    }).sort({ createdAt: -1 })

    res.json(reviews)
  })
)

// ==================================================
// ADD REVIEW (Login Required + One Review Only)
// ==================================================
router.post(
  '/:productId',
  protect,
  asyncHandler(async (req, res) => {
    const { rating, comment, images } = req.body

    const product = await Product.findById(req.params.productId)

    if (!product) {
      res.status(404)
      throw new Error('Product not found')
    }

    // 🚀 Only One Review Per User
    const alreadyReviewed = await Review.findOne({
      product: product._id,
      user: req.user._id,
    })

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('You already reviewed this product')
    }

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
      images: images || [],
      isApproved: false, // still requires admin approval
      helpfulCount: 0,
    })

    res.status(201).json(review)
  })
)

// ==================================================
// MARK REVIEW AS HELPFUL
// ==================================================
router.patch(
  '/:id/helpful',
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
      res.status(404)
      throw new Error('Review not found')
    }

    review.helpfulCount += 1
    await review.save()

    res.json({ message: 'Marked as helpful' })
  })
)

// ==================================================
// ADMIN GET ALL REVIEWS
// ==================================================
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const reviews = await Review.find({})
      .populate('product', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })

    res.json(reviews)
  })
)

// ==================================================
// ADMIN APPROVE REVIEW
// ==================================================
router.patch(
  '/:id/approve',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
      res.status(404)
      throw new Error('Review not found')
    }

    review.isApproved = true
    await review.save()

    // Recalculate rating
    const reviews = await Review.find({
      product: review.product,
      isApproved: true,
    })

    const product = await Product.findById(review.product)

    product.numReviews = reviews.length
    product.rating =
      reviews.length > 0
        ? reviews.reduce((acc, item) => acc + item.rating, 0) /
          reviews.length
        : 0

    await product.save()

    res.json({ message: 'Review approved' })
  })
)

// ==================================================
// ADMIN DELETE REVIEW
// ==================================================
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
      res.status(404)
      throw new Error('Review not found')
    }

    await review.deleteOne()

    res.json({ message: 'Review deleted' })
  })
)

module.exports = router