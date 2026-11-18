const { verifyToken } = require('../utils/jwt');
const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return ApiResponse.error(res, 'Authentication required. Please log in.', 401);
  }

  const decoded = verifyToken(token);
  const userId = decoded?.id || decoded?._id || decoded?.userId;
  if (!decoded || !userId) {
    return ApiResponse.error(res, 'Invalid or expired session token. Please log in again.', 401);
  }

  const user = await dataStore.findUserById(userId);
  if (!user) {
    return ApiResponse.error(res, 'User not found.', 401);
  }

  req.user = user;
  next();
};

const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    const decoded = verifyToken(token);
    const userId = decoded?.id || decoded?._id || decoded?.userId;
    if (userId) {
      const user = await dataStore.findUserById(userId);
      if (user) {
        req.user = user;
      }
    }
  }
  next();
};

const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return ApiResponse.error(res, 'Access denied. Administrator privileges required.', 403);
  }
  next();
};

module.exports = {
  protect,
  optionalAuth,
  adminOnly
};

