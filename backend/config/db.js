const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // This is the clean, modern connection without deprecated options
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Adding an EXTRA line to prove this code is running
    console.log('--- DB.JS FIX APPLIED ---'); 
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

module.exports = connectDB;