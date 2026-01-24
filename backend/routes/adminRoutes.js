const express = require('express')
const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel')
const User = require('../models/userModel')
const { protect, admin } = require('../middleware/authMiddleware')

const router = express.Router()

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get(
  '/stats',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const totalSales = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ])

    const totalOrders = await Order.countDocuments()
    const totalUsers = await User.countDocuments()

    // Monthly sales
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          total: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ])

    res.json({
      totalSales: totalSales[0]?.total || 0,
      totalOrders,
      totalUsers,
      monthlySales,
    })
  })
)

module.exports = router
