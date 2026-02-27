const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    bannerImage: {
      type: String,
      default: "/banners/default.jpg",
    },

    // 🔥 ENTERPRISE FEATURES

    isActive: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },

    level: {
      type: Number,
      default: 0,
    },

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

// ================= INDEXING =================
categorySchema.index({ slug: 1, parent: 1 }, { unique: true });
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ sortOrder: 1 });

// ================= PRE SAVE =================
categorySchema.pre("save", function (next) {
  if (!this.parent) {
    this.level = 0;
  }
  next();
});

module.exports = mongoose.model("Category", categorySchema);