const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

router.get('/', wishlistController.getWishlist);
router.post('/toggle', wishlistController.toggleWishlist);

module.exports = router;
