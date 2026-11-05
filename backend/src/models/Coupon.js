const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, required: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minimumSpend: { type: Number, default: 0 },
  maxDiscount: { type: Number, default: 1000 },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  usageLimit: { type: Number, default: 1000 },
  usageCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);

