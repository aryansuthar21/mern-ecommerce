const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// ✅ NEW: Schema for specific inventory variants
const variantSchema = mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  countInStock: { type: Number, required: true, default: 0 }
}, { _id: false }); // _id is false so we don't generate unique IDs for every variant, keeping it simple

const productSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    
    description: { type: String, required: true },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    price: { type: Number, required: true },
    
    // Global Stock (Sum of all variants, calculated on save)
    countInStock: { type: Number, required: true, default: 0 },

    // ✅ NEW: List of all size/color combinations
    variants: [variantSchema] 
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);