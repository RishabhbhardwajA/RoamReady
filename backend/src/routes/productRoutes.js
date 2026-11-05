const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/kits', productController.getTravelKits);
router.post('/compare', productController.compareProducts);
router.post('/finder', productController.smartTravelFinder);
router.get('/check-pincode/:pincode', productController.checkDeliveryPincode);
router.get('/:slug', productController.getProductBySlug);

module.exports = router;
