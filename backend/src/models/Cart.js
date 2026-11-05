const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  colorName: { type: String, default: 'Standard' },
  size: { type: String, default: 'Standard' },
  quantity: { type: Number, required: true, min: 1, default: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sessionId: { type: String, index: true },
  items: [cartItemSchema],
  appliedCoupon: {
    code: { type: String, default: null },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 }
  },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, {
  timestamps: true
});

cartSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Free shipping over 999 INR, otherwise 99 INR
  this.shipping = this.subtotal > 999 || this.subtotal === 0 ? 0 : 99;

  let calculatedDiscount = 0;
  if (this.appliedCoupon && this.appliedCoupon.code) {
    if (this.appliedCoupon.discountPercent > 0) {
      calculatedDiscount = Math.round((this.subtotal * this.appliedCoupon.discountPercent) / 100);
    } else if (this.appliedCoupon.discountAmount > 0) {
      calculatedDiscount = this.appliedCoupon.discountAmount;
    }
  }
  this.discount = Math.min(calculatedDiscount, this.subtotal);
  this.total = Math.max(0, this.subtotal - this.discount + this.shipping);
};

module.exports = mongoose.model('Cart', cartSchema);

