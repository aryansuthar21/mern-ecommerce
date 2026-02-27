const mongoose = require("mongoose");
const slugify = require("slugify");

/* ===========================================================
   VARIANT SCHEMA
=========================================================== */
const variantSchema = mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

/* ===========================================================
   PRODUCT SCHEMA
=========================================================== */
const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    image: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    // 🔥 Global stock (auto-calculated from variants)
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      index: true,
    },

    variants: {
      type: [variantSchema],
      validate: [
        {
          validator: function (value) {
            return value.length > 0;
          },
          message: "At least one variant is required",
        },
      ],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    // 🔥 SEO FIELDS
    seoTitle: {
      type: String,
      trim: true,
    },

    seoDescription: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

/* ===========================================================
   INDEXES (IMPORTANT FOR RETAIL SCALE)
=========================================================== */

// Combined filtering index
productSchema.index({ category: 1, price: 1 });
productSchema.index({ category: 1, rating: -1 });
productSchema.index({ createdAt: -1 });

/* ===========================================================
   AUTO GENERATE SLUG
=========================================================== */
productSchema.pre("save", function (next) {
  if (!this.slug || this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
    });
  }

  // 🔥 Auto-calculate total stock from variants
  if (this.variants && this.variants.length > 0) {
    this.countInStock = this.variants.reduce(
      (total, variant) => total + variant.countInStock,
      0
    );
  }

  next();
});

module.exports = mongoose.model("Product", productSchema);