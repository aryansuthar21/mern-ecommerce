// Middleware for handling 404 Not Found routes
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// General error handler middleware
const errorHandler = (err, req, res, next) => {
  // Check if the status code is already set to 200 (success), if so, change to 500 (server error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Only show stack trace if we are in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };