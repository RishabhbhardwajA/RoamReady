const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/roamready',
  JWT_SECRET: process.env.JWT_SECRET || 'roamready-super-secure-jwt-secret-key-2026-travel-gear',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_RoamReadyDemoKeyId',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'demoSecretRoamReadyKey123'
};

