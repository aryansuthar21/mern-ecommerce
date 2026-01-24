// backend/fixData.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/productModel');
const Category = require('./models/categoryModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const migrateData = async () => {
  try {
    const products = await Product.find({});
    console.log(`Found ${products.length} products. Checking for legacy data...`);

    for (let product of products) {
      // Check if category is a String (Legacy Data)
      if (typeof product.category === 'string' || !mongoose.Types.ObjectId.isValid(product.category)) {
        console.log(`Migrating product: ${product.name} (${product.category})`);
        
        // Find or Create the Category Object
        let categoryObj = await Category.findOne({ name: { $regex: new RegExp(`^${product.category}$`, "i") } });
        
        if (!categoryObj) {
            // Create fallback category if missing
            categoryObj = await Category.create({
                name: product.category || 'Uncategorized',
                slug: (product.category || 'uncategorized').toLowerCase().replace(/ /g, '-'),
                section: 'new' // Default section
            });
        }

        product.category = categoryObj._id;
        await product.save();
        console.log(`✅ Fixed: ${product.name}`);
      }
    }
    console.log('Migration Complete. Press Ctrl+C to exit.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

migrateData();