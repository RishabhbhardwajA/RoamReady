const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productIdString: { type: String },
  variantId: { type: String, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String, required: true },
  colorName: { type: String, default: 'Standard' },
  size: { type: String, default: 'Standard' }
}, { _id: false });

const orderTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  note: { type: String, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  customerDetails: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true }
  },
  shippingAddress: {
    street: { type: String, required: true },
    apartment: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  items: [orderItemSchema],
  pricing: {
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true }
  },
  couponApplied: {
    code: { type: String },
    discountAmount: { type: Number, default: 0 }
  },
  payment: {
    method: { type: String, enum: ['upi', 'card', 'netbanking', 'cod'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    isDemoMode: { type: Boolean, default: true }
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'confirmed'
  },
  tracking: {
    carrier: { type: String, default: 'BlueDart Air Express' },
    trackingNumber: { type: String, default: '' },
    estimatedDelivery: { type: Date },
    timeline: [orderTimelineSchema]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

