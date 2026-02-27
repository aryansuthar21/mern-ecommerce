const express = require('express')
const multer = require('multer')
const cloudinary = require('../utils/cloudinary')
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post(
  '/',
  protect,
  upload.array('images', 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(200).json([])
      }

      const uploadedImages = []

      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
          {
            folder: 'reviews',
          }
        )

        uploadedImages.push(result.secure_url)
      }

      res.status(200).json(uploadedImages)
    } catch (error) {
      console.error('Cloudinary Upload Error:', error)
      res.status(500).json({ message: 'Cloudinary upload failed' })
    }
  }
)

module.exports = router