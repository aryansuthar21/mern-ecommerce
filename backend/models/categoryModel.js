const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    // If parent is null, it acts as a Top-Level section (e.g., Men, Women)
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    description: { type: String },
    bannerImage: { type: String, default: '/banners/default.jpg' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);