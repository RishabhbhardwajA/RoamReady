const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : 'guest_wishlist';
    const items = await dataStore.getWishlist(userId);
    return ApiResponse.success(res, 'Wishlist fetched', { items });
  } catch (error) {
    next(error);
  }
};

const toggleWishlist = async (req, res, next) => {
  try {
    const { productIdOrSlug } = req.body;
    if (!productIdOrSlug) {
      return ApiResponse.error(res, 'Product ID or slug is required', 400);
    }

    const userId = req.user ? req.user._id : 'guest_wishlist';
    const result = await dataStore.toggleWishlist(userId, productIdOrSlug);

    return ApiResponse.success(res, result.isAdded ? 'Added to wishlist' : 'Removed from wishlist', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist
};
