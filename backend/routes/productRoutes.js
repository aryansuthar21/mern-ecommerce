  const express = require('express')
  const mongoose = require('mongoose')
  const asyncHandler = require('express-async-handler')
  const multer = require('multer')
  const xlsx = require('xlsx')

  const Product = require('../models/productModel')
  const Category = require('../models/categoryModel')
  const { protect, admin } = require('../middleware/authMiddleware')

  const router = express.Router()

  // ================= MULTER CONFIG =================
  const upload = multer({ storage: multer.memoryStorage() })

  // ================= RECURSIVE CATEGORY HELPER =================
  const getAllChildIds = async (parentId) => {
    let childIds = [parentId]
    const children = await Category.find({ parent: parentId })

    for (const child of children) {
      const nested = await getAllChildIds(child._id)
      childIds = childIds.concat(nested)
    }

    return childIds
  }

  // ============================================================
  // ✅ PUBLIC PRODUCTS (HOME, CATEGORY, SEARCH)
  // @route   GET /api/products/public
  // ============================================================
  router.get(
    '/public',
    asyncHandler(async (req, res) => {
      const { category, keyword, minPrice, maxPrice, sort } = req.query
      let query = {}

      if (keyword) {
        query.name = { $regex: keyword, $options: 'i' }
      }

      if (category && category !== 'all') {
        let foundCategory = null

        if (mongoose.Types.ObjectId.isValid(category)) {
          foundCategory = await Category.findById(category)
        }

        if (!foundCategory) {
          foundCategory = await Category.findOne({ slug: category })
        }

        if (foundCategory) {
          const allIds = await getAllChildIds(foundCategory._id)
          query.category = { $in: allIds }
        } else {
          return res.json([])
        }
      }

      if (minPrice || maxPrice) {
        query.price = {}
        if (minPrice) query.price.$gte = Number(minPrice)
        if (maxPrice) query.price.$lte = Number(maxPrice)
      }

      let sortOption = { createdAt: -1 }
      if (sort === 'price-asc') sortOption = { price: 1 }
      if (sort === 'price-desc') sortOption = { price: -1 }

      const products = await Product.find(query)
        .populate('category', 'name slug parent')
        .sort(sortOption)

      res.json(products)
    })
  )

  // ============================================================
  // ✅ ADMIN: FETCH ALL PRODUCTS
  // @route   GET /api/products
  // ============================================================
  router.get(
    '/',
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const { category, keyword, minPrice, maxPrice, sort } = req.query
      let query = {}

      if (keyword) {
        query.name = { $regex: keyword, $options: 'i' }
      }

      if (category && category !== 'all') {
        let foundCategory = null

        if (mongoose.Types.ObjectId.isValid(category)) {
          foundCategory = await Category.findById(category)
        }

        if (!foundCategory) {
          foundCategory = await Category.findOne({ slug: category })
        }

        if (foundCategory) {
          const allIds = await getAllChildIds(foundCategory._id)
          query.category = { $in: allIds }
        } else {
          return res.json([])
        }
      }

      if (minPrice || maxPrice) {
        query.price = {}
        if (minPrice) query.price.$gte = Number(minPrice)
        if (maxPrice) query.price.$lte = Number(maxPrice)
      }

      let sortOption = { createdAt: -1 }
      if (sort === 'price-asc') sortOption = { price: 1 }
      if (sort === 'price-desc') sortOption = { price: -1 }

      const products = await Product.find(query)
        .populate('category', 'name slug parent')
        .sort(sortOption)

      res.json(products)
    })
  )

  // ============================================================
  // IMPORT PRODUCTS
  // ============================================================
  router.post(
    '/import',
    protect,
    admin,
    upload.single('file'),
    asyncHandler(async (req, res) => {
      if (!req.file) {
        res.status(400)
        throw new Error('No file uploaded')
      }

      const workbook = xlsx.read(req.file.buffer, { type: 'buffer' })
      const sheetName = workbook.SheetNames[0]
      const sheet = workbook.Sheets[sheetName]
      const data = xlsx.utils.sheet_to_json(sheet)

      const productsToInsert = []

      for (const row of data) {
        let categoryId = null

        if (row.Category) {
          const subCat = await Category.findOne({
            name: { $regex: new RegExp(`^${row.Category}$`, 'i') },
          })
          if (subCat) categoryId = subCat._id
        }

        if (!categoryId) {
          const defaultCat = await Category.findOne()
          if (defaultCat) categoryId = defaultCat._id
        }

        let parsedVariants = []

        if (row.Variants) {
          const variantString = String(row.Variants)
          const variantList = variantString.split(',')

          parsedVariants = variantList.map((v) => {
            const parts = v.trim().split('|')
            return {
              size: parts[0] || 'One Size',
              color: parts[1] || 'Standard',
              countInStock: Number(parts[2]) || 0,
            }
          })
        }

        const totalStock = parsedVariants.reduce(
          (acc, item) => acc + item.countInStock,
          0
        )

        productsToInsert.push({
          user: req.user._id,
          name: row.Name,
          image: row.Image || '/images/sample.jpg',
          brand: row.Brand,
          category: categoryId,
          description: row.Description,
          price: row.Price,
          countInStock: totalStock,
          variants: parsedVariants,
          rating: 0,
          numReviews: 0,
        })
      }

      await Product.insertMany(productsToInsert)

      res.json({
        message: `${productsToInsert.length} products imported successfully!`,
      })
    })
  )

  // ============================================================
  // RELATED PRODUCTS
  // ============================================================
  router.get(
    '/:id/related',
    asyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id)

      if (!product) {
        res.status(404)
        throw new Error('Product not found')
      }

      const related = await Product.find({
        category: product.category,
        _id: { $ne: product._id },
      }).limit(4)

      res.json(related)
    })
  )

  // ============================================================
  // SINGLE PRODUCT
  // ============================================================
  router.get(
    '/:id',
    asyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id).populate('category')

      if (!product) {
        res.status(404)
        throw new Error('Product not found')
      }

      res.json(product)
    })
  )

  // ============================================================
  // CREATE PRODUCT
  // ============================================================
  router.post(
    '/',
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const defaultCategory = await Category.findOne({})

      const product = new Product({
        name: 'Sample name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample brand',
        category: defaultCategory ? defaultCategory._id : null,
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
        variants: [],
      })

      const createdProduct = await product.save()
      res.status(201).json(createdProduct)
    })
  )

  // ============================================================
  // UPDATE PRODUCT
  // ============================================================
  router.put(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const { name, price, description, image, brand, category, variants } =
        req.body

      const product = await Product.findById(req.params.id)

      if (!product) {
        res.status(404)
        throw new Error('Product not found')
      }

      product.name = name || product.name
      product.price = price || product.price
      product.description = description || product.description
      product.image = image || product.image
      product.brand = brand || product.brand
      product.category = category || product.category

      if (variants) {
        product.variants = variants
        product.countInStock = variants.reduce(
          (acc, item) => acc + Number(item.countInStock),
          0
        )
      }

      const updatedProduct = await product.save()
      res.json(updatedProduct)
    })
  )

  // ============================================================
  // DELETE PRODUCT
  // ============================================================
  router.delete(
    '/:id',
    protect,
    admin,
    asyncHandler(async (req, res) => {
      const product = await Product.findById(req.params.id)

      if (!product) {
        res.status(404)
        throw new Error('Product not found')
      }

      await Product.deleteOne({ _id: product._id })
      res.json({ message: 'Product removed' })
    })
  )

  module.exports = router
