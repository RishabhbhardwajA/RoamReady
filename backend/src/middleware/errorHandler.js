const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  console.error(`[Error Handler] ${req.method} ${req.url} - Error:`, err);

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors || {}).map(e => e.message);
    return ApiResponse.error(res, 'Validation error', 400, errors);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return ApiResponse.error(res, `A record with this ${field} already exists.`, 409);
  }

  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.error(res, 'Invalid authentication token.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return ApiResponse.error(res, 'Authentication token expired. Please log in again.', 401);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  return ApiResponse.error(res, message, statusCode, process.env.NODE_ENV === 'development' ? err.stack : null);
};

module.exports = errorHandler;
