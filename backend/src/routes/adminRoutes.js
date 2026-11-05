const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Protect all admin endpoints with authentication and admin role check
router.use(protect);
router.use(adminOnly);

router.get('/metrics', adminController.getDashboardStats);
router.get('/products', adminController.getAdminProducts);
router.post('/products', adminController.createProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getAdminOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

router.get('/customers', adminController.getAdminCustomers);
router.get('/coupons', adminController.getAdminCoupons);
router.post('/coupons', adminController.createCoupon);
router.get('/reviews', adminController.getAdminReviews);

module.exports = router;
