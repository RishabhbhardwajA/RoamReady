const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const getProductReviews = async (req, res, next) => {
  try {
    const { productSlug } = req.params;
    const reviews = await dataStore.findReviewsByProduct(productSlug);
    return ApiResponse.success(res, 'Reviews fetched', { reviews });
  } catch (error) {
    next(error);
  }
};

const addReview = async (req, res, next) => {
  try {
    const { productSlug, rating, title, comment, travelType } = req.body;

    const product = await dataStore.findProductBySlug(productSlug);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }

    const userName = req.user ? req.user.name : (req.body.userName || 'Verified Traveler');
    const userCity = req.body.userCity || 'Mumbai';

    const review = await dataStore.createReview({
      product: product._id,
      productSlug,
      user: req.user ? req.user._id : null,
      userName,
      userCity,
      rating: Number(rating),
      title,
      comment,
      travelType: travelType || 'Leisure Traveler',
      verifiedPurchase: true
    });

    return ApiResponse.success(res, 'Review submitted successfully and approved!', { review }, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  addReview
};
