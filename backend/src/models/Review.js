const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productSlug: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  userName: { type: String, required: true },
  userCity: { type: String, default: 'Mumbai' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true },
  comment: { type: String, required: true },
  verifiedPurchase: { type: Boolean, default: true },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
  helpfulVotes: { type: Number, default: 0 },
  travelType: { type: String, default: 'Frequent Flyer' }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
