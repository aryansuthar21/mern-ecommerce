const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config()

console.log("Key Loaded:", process.env.RAZORPAY_KEY_ID ? "YES" : "NO")

const connectDB = require('./config/db')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

const productRoutes = require('./routes/productRoutes')
const userRoutes = require('./routes/userRoutes')
const uploadRoutes = require('./routes/uploadRoutes')
const orderRoutes = require('./routes/orderRoutes')
const adminRoutes = require('./routes/adminRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const wishlistRoutes = require('./routes/wishlistRoutes')
const googleAuthRoutes = require('./routes/googleAuthRoutes')
const reviewRoutes = require('./routes/reviewRoutes')
const reviewUploadRoutes = require('./routes/reviewUploadRoutes')

connectDB()

const app = express()

/* =========================
   ✅ FINAL CORS FIX
========================= */
app.use(cors({
  origin: true,
  credentials: true,
}))
app.options('*', cors())

// ✅ Preflight requests fix
app.options('*', cors())

/* =========================
   Middlewares
========================= */
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups")
  next()
})

/* =========================
   Routes
========================= */
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/auth/google', googleAuthRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/review-upload', reviewUploadRoutes)

/* =========================
   Uploads Static
========================= */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

/* =========================
   Root Test Route
========================= */
app.get('/', (req, res) => {
  res.send('API is running....')
})

/* =========================
   Error Handlers
========================= */
app.use(notFound)
app.use(errorHandler)

/* =========================
   Start Server
========================= */
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

