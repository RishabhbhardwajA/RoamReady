const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items', cartController.updateQuantity);
router.delete('/items/:variantId', cartController.removeItem);
router.post('/coupon', cartController.applyCoupon);
router.delete('/coupon', cartController.removeCoupon);
router.delete('/', cartController.clearCart);

module.exports = router;
