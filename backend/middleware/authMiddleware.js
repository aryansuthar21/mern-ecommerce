const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check if the token is present in the authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Extract the token from 'Bearer <token>'
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Find the user associated with the token ID and attach it to the request (req.user)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware or the route handler
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
    // req.user is populated by the 'protect' middleware which runs first
    if (req.user && req.user.isAdmin) {
        // User is authenticated and is an admin
        next(); 
    } else {
        // User is not an admin
        res.status(401); 
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect,admin };