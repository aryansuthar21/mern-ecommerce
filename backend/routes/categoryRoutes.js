const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const slugify = require("slugify");

const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

/* ===========================================================
   CREATE CATEGORY
=========================================================== */
router.post(
  "/",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, parent, description, sortOrder } = req.body;

    if (!name || name.trim().length < 2) {
      res.status(400);
      throw new Error("Category name must be at least 2 characters");
    }

    const slug = slugify(name, { lower: true, strict: true });

    const existing = await Category.findOne({
      slug,
      parent: parent || null,
    });

    if (existing) {
      res.status(400);
      throw new Error("Category already exists in this section");
    }

    let level = 0;

    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (!parentCategory) {
        res.status(400);
        throw new Error("Invalid parent category");
      }
      level = parentCategory.level + 1;
    }

    const category = await Category.create({
      name,
      slug,
      parent: parent || null,
      description,
      sortOrder: sortOrder || 0,
      level,
    });

    res.status(201).json(category);
  })
);

/* ===========================================================
   GET TREE STRUCTURE (Public)
=========================================================== */
router.get(
  "/tree",
  asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    const map = {};
    const roots = [];

    categories.forEach((cat) => {
      cat.children = [];
      map[cat._id] = cat;
    });

    categories.forEach((cat) => {
      if (cat.parent) {
        map[cat.parent]?.children.push(cat);
      } else {
        roots.push(cat);
      }
    });

    res.json(roots);
  })
);

/* ===========================================================
   UPDATE CATEGORY (SAFE SLUG)
=========================================================== */
router.put(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res.status(400);
      throw new Error("Invalid category ID");
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    const { name, description, sortOrder, isActive } = req.body;

    if (name && name !== category.name) {
      const newSlug = slugify(name, { lower: true, strict: true });

      const exists = await Category.findOne({
        slug: newSlug,
        parent: category.parent,
        _id: { $ne: category._id },
      });

      if (exists) {
        res.status(400);
        throw new Error("Another category with same name exists");
      }

      category.name = name;
      category.slug = newSlug;
    }

    category.description = description ?? category.description;
    category.sortOrder = sortOrder ?? category.sortOrder;
    category.isActive = isActive ?? category.isActive;

    const updated = await category.save();
    res.json(updated);
  })
);

/* ===========================================================
   SOFT DELETE CATEGORY
=========================================================== */
router.delete(
  "/:id",
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404);
      throw new Error("Category not found");
    }

    const childExists = await Category.findOne({
      parent: category._id,
    });

    if (childExists) {
      res.status(400);
      throw new Error("Remove subcategories first");
    }

    const productExists = await Product.findOne({
      category: category._id,
    });

    if (productExists) {
      res.status(400);
      throw new Error("Remove products under this category first");
    }

    category.isActive = false;
    await category.save();

    res.json({ message: "Category disabled successfully" });
  })
);

// ============================================================
// ✅ GET CATEGORY TREE (PUBLIC)
// @route   GET /api/categories/tree
// ============================================================
router.get(
  "/tree",
  asyncHandler(async (req, res) => {
    const categories = await Category.find({}).lean();

    const map = {};
    categories.forEach((cat) => {
      map[cat._id.toString()] = {
        ...cat,
        children: [],
      };
    });

    const tree = [];

    categories.forEach((cat) => {
      if (cat.parent) {
        const parentId = cat.parent.toString();

        if (map[parentId]) {
          map[parentId].children.push(
            map[cat._id.toString()]
          );
        }
      } else {
        tree.push(map[cat._id.toString()]);
      }
    });

    res.json(tree);
  })
);

module.exports = router;