const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, optionalAuth } = require('../middleware/auth');
const { validate, createOrderSchema } = require('../validators/schemas');

router.post('/', optionalAuth, validate(createOrderSchema), orderController.createOrder);
router.get('/my-orders', protect, orderController.getUserOrders);
router.post('/track', orderController.trackOrder);
router.get('/:id', optionalAuth, orderController.getOrderById);

module.exports = router;
