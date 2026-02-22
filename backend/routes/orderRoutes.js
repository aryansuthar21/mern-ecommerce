const express = require('express')
const asyncHandler = require('express-async-handler')
const Order = require('../models/orderModel')
const Product = require('../models/productModel')
const { protect, admin } = require('../middleware/authMiddleware')
const { createShiprocketOrder } = require('../utils/shiprocket')
// ✅ Import Notification Helpers
const { generateInvoicePDF, sendInvoiceEmail, sendOrderSMS } = require('../utils/invoiceHelper')

const router = express.Router()

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body

    if (!orderItems || orderItems.length === 0) {
      res.status(400)
      throw new Error('No order items')
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    })

    const createdOrder = await order.save()

    // 🚀 Create Shiprocket Order (Test Mode)
try {
  const shiprocketResponse = await createShiprocketOrder(
    createdOrder,
    req.user
  )

  createdOrder.shiprocketOrderId =
    shiprocketResponse.order_id || null

  createdOrder.shiprocketShipmentId =
    shiprocketResponse.shipment_id || null

  await createdOrder.save()

  console.log('🚀 Shiprocket Order Created')
} catch (error) {
  console.error('❌ Shiprocket Error:', error.message)
}

    // ✅ UPDATED STOCK REDUCTION LOGIC (Support Variants)
    for (const item of orderItems) {
      const product = await Product.findById(item.product)

      if (product) {
        // 1. Reduce Global Stock
        product.countInStock -= item.qty
        if (product.countInStock < 0) product.countInStock = 0

        // 2. Reduce Specific Variant Stock (Size/Color)
        if (item.size && item.color && product.variants) {
          const variant = product.variants.find(
            (v) => v.size === item.size && v.color === item.color
          )
          if (variant) {
            variant.countInStock -= item.qty
            if (variant.countInStock < 0) variant.countInStock = 0
          }
        }

        await product.save()
      }
    }

    // ✅ 🔥 NEW: Trigger Notifications IMMEDIATELY on Creation
    // This runs after the order is saved but before the response is sent.
    try {
        const user = req.user; // Logged in user details

        console.log(`📨 Sending confirmation for Order ID: ${createdOrder._id}`);
        
        // 1. Send "Order Placed" Email (No PDF yet, just confirmation)
        await sendInvoiceEmail(createdOrder, user, null);
        
        // 2. Send SMS to the shipping phone number
        await sendOrderSMS(createdOrder, user);
        
        console.log('✅ Order confirmation notifications sent.');
    } catch (error) {
        // We catch errors so the order process doesn't fail if email/SMS is down
        console.error('❌ Notification Error:', error.message);
    }

    res.status(201).json(createdOrder)
  })
)

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name email')
    res.json(orders)
  })
)

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get(
  '/myorders',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
    res.json(orders)
  })
)

// @desc    Admin dashboard summary
// @route   GET /api/orders/admin/summary
// @access  Private/Admin
router.get(
  '/admin/summary',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({})
    const usersCount = await require('../models/userModel').countDocuments()
    const productsCount = await require('../models/productModel').countDocuments()

    const totalSales = orders.reduce(
      (acc, order) => acc + order.totalPrice,
      0
    )

    const today = new Date()
    const todaySales = orders
      .filter(
        (o) =>
          o.createdAt.toDateString() === today.toDateString()
      )
      .reduce((acc, o) => acc + o.totalPrice, 0)

    res.json({
      totalOrders: orders.length,
      totalUsers: usersCount,
      totalProducts: productsCount,
      totalSales,
      todaySales,
    })
  })
)

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    )

    if (order) {
      res.json(order)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  })
)

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
router.put(
  '/:id/pay',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if (order) {
      order.isPaid = true
      order.paidAt = Date.now()
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }

      const updatedOrder = await order.save()

      // ✅ AUTOMATION: Send Official Invoice PDF on Payment
      try {
          // 1. Generate PDF Invoice (Only after payment)
          const pdfBuffer = await generateInvoicePDF(updatedOrder, updatedOrder.user)
          
          // 2. Send Email with Attached PDF
          await sendInvoiceEmail(updatedOrder, updatedOrder.user, pdfBuffer)
          
          // Note: We don't necessarily need another SMS here, but you can add it if you want.
          
      } catch (error) {
          console.error('Notification Error (Payment):', error)
      }

      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  })
)

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
router.put(
  '/:id/deliver',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)

    if (order) {
      order.isDelivered = true
      order.deliveredAt = Date.now()
      const updatedOrder = await order.save()
      res.json(updatedOrder)
    } else {
      res.status(404)
      throw new Error('Order not found')
    }
  })
)

module.exports = router