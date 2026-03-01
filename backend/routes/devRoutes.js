const express = require('express')
const asyncHandler = require('express-async-handler')

const Product = require('../models/productModel')
const Category = require('../models/categoryModel')

const router = express.Router()

// ⚠ DEV ONLY — REMOVE AFTER USE
router.delete(
  '/reset',
  asyncHandler(async (req, res) => {
    await Product.deleteMany({})
    await Category.deleteMany({})

    res.json({ message: 'Products and Categories deleted successfully' })
  })
)

module.exports = router     