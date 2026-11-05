const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, registerSchema, loginSchema, addressSchema } = require('../validators/schemas');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);
router.post('/addresses', protect, validate(addressSchema), authController.addAddress);

module.exports = router;
