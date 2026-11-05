const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { optionalAuth } = require('../middleware/auth');
const { validate, addReviewSchema } = require('../validators/schemas');

router.get('/product/:productSlug', reviewController.getProductReviews);
router.post('/', optionalAuth, validate(addReviewSchema), reviewController.addReview);

module.exports = router;
