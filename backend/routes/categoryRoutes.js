const express = require('express')
const asyncHandler = require('express-async-handler')
const Category = require('../models/categoryModel')
const { protect, admin } = require('../middleware/authMiddleware')
const slugify = require('slugify')

const router = express.Router()

// ============================================================
// ✅ CREATE CATEGORY (ADMIN)
// ============================================================
router.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, parent } = req.body

    if (!name) {
      res.status(400)
      throw new Error('Category name is required')
    }

    const slug = slugify(name, { lower: true, strict: true })

    // ❗ Prevent duplicate category
    const exists = await Category.findOne({ slug })
    if (exists) {
      res.status(400)
      throw new Error('Category already exists')
    }

    const category = await Category.create({
      name,
      slug,
      parent: parent || null,
    })

    res.status(201).json(category)
  })
)

// ============================================================
// ✅ GET ALL CATEGORIES (PUBLIC / ADMIN)
// ============================================================
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await Category.find({})
      .populate('parent', 'name slug')
      .sort({ createdAt: 1 })

    res.json(categories)
  })
)

// ============================================================
// ✅ UPDATE CATEGORY (ADMIN)
// ============================================================
router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, parent } = req.body

    const category = await Category.findById(req.params.id)

    if (category) {
      if (name) {
        category.name = name
        category.slug = slugify(name, { lower: true, strict: true })
      }

      category.parent = parent || null

      const updated = await category.save()
      res.json(updated)
    } else {
      res.status(404)
      throw new Error('Category not found')
    }
  })
)

// ============================================================
// ✅ DELETE CATEGORY (ADMIN)
// ============================================================
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id)

    if (!category) {
      res.status(404)
      throw new Error('Category not found')
    }

    // ❗ Prevent deleting if child categories exist
    const children = await Category.find({ parent: category._id })
    if (children.length > 0) {
      res.status(400)
      throw new Error('Delete sub-categories first')
    }

    await category.deleteOne()
    res.json({ message: 'Category removed' })
  })
)

module.exports = router
