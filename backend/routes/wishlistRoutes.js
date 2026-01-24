const express = require('express')
const asyncHandler = require('express-async-handler')
const Wishlist = require('../models/wishlistModel')
const Product = require('../models/productModel')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id })
  
  if (!wishlist) {
    // If no wishlist exists yet, return empty array instead of 404
    return res.json({ products: [] })
  }
  
  res.json(wishlist)
}))

// @desc    Add item to wishlist
// @route   POST /api/wishlist
// @access  Private
router.post('/', protect, asyncHandler(async (req, res) => {
  const { productId } = req.body
  const product = await Product.findById(productId)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  let wishlist = await Wishlist.findOne({ user: req.user._id })

  if (wishlist) {
    // Check if product already exists
    const alreadyExists = wishlist.products.find(
      (p) => p.product.toString() === productId.toString()
    )

    if (alreadyExists) {
      res.status(400)
      throw new Error('Product already in wishlist')
    }

    // Add new item
    wishlist.products.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price
    })
    
    await wishlist.save()
    res.status(201).json(wishlist)
  } else {
    // Create new wishlist if none exists
    const newWishlist = await Wishlist.create({
      user: req.user._id,
      products: [{
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price
      }]
    })
    res.status(201).json(newWishlist)
  }
}))

// @desc    Remove item from wishlist
// @route   DELETE /api/wishlist/:id
// @access  Private
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const productId = req.params.id
  const wishlist = await Wishlist.findOne({ user: req.user._id })

  if (wishlist) {
    // Filter out the item to remove it
    wishlist.products = wishlist.products.filter(
      (p) => p.product.toString() !== productId.toString()
    )
    
    await wishlist.save()
    res.json(wishlist)
  } else {
    res.status(404)
    throw new Error('Wishlist not found')
  }
}))

module.exports = router