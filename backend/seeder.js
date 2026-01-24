const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const products = require('./data/products'); 
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Order = require('./models/orderModel'); // ✅ FIXED: Ensure this is imported
const Category = require('./models/categoryModel');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. CLEAR ALL DATA
    // Clearing orders first prevents foreign key conflicts
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany(); 
    console.log('🗑️  Data Destroyed (Clean Slate)...');

    // 2. CREATE USERS
    const createdUsers = await User.insertMany(users);
    // Ensure the first user in your data/users.js has isAdmin: true
    const adminUser = createdUsers[0]._id;
    console.log('✅ Users Created');

    // 3. CREATE CATEGORY TREE (Zara Style)
    // -- Level 1: Roots --
    const men = await Category.create({ name: 'Men', slug: 'men', parent: null });
    const women = await Category.create({ name: 'Women', slug: 'women', parent: null });
    const accessories = await Category.create({ name: 'Accessories', slug: 'accessories', parent: null });
    const newArrivals = await Category.create({ name: 'New', slug: 'new', parent: null });

    // -- Level 2: Sub-Categories (Linked to Parent IDs) --
    const menShirts = await Category.create({ name: 'Shirts', slug: 'men-shirts', parent: men._id });
    const menJeans = await Category.create({ name: 'Jeans', slug: 'men-jeans', parent: men._id });
    const menJackets = await Category.create({ name: 'Jackets', slug: 'men-jackets', parent: men._id });
    
    const womenDresses = await Category.create({ name: 'Dresses', slug: 'women-dresses', parent: women._id });
    const womenTops = await Category.create({ name: 'Tops', slug: 'women-tops', parent: women._id });
    
    const accWatches = await Category.create({ name: 'Watches', slug: 'acc-watches', parent: accessories._id });
    const accBags = await Category.create({ name: 'Bags', slug: 'acc-bags', parent: accessories._id });

    console.log('✅ Categories Created (Hierarchical Structure)');

    // 4. CREATE PRODUCTS (Linked to valid Category ObjectIds)
    const sampleProducts = products.map((product) => {
      // Logic: Map sample data to new category IDs
      let catId = menShirts._id; // Default
      
      const pName = product.name.toLowerCase();
      if(pName.includes('dress')) catId = womenDresses._id;
      if(pName.includes('watch')) catId = accWatches._id;
      if(pName.includes('bag')) catId = accBags._id;
      if(pName.includes('jean')) catId = menJeans._id;
      if(pName.includes('jacket')) catId = menJackets._id;

      return { 
        ...product, 
        user: adminUser,
        category: catId // 🔥 This ensures products are valid ObjectIds
      };
    });

    await Product.insertMany(sampleProducts);
    console.log('✅ Products Imported');

    console.log('🎉 Database Seeding Complete!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log('🗑️ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}