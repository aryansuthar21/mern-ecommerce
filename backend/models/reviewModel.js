const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
    },

    comment: {
      type: String,
      required: true,
    },

  images: {
    type:[String],
    default:[],
  },

    isApproved: {
      type: Boolean,
      default: false,
    },

    helpfulCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// prevent duplicate review per product per user
reviewSchema.index({ user: 1, product: 1 }, { unique: true })

module.exports = mongoose.model('Review', reviewSchema)