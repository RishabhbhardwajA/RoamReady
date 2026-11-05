const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  image: { type: String, required: true },
  icon: { type: String, default: 'Luggage' },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  badge: { type: String, default: '' },
  productCount: { type: Number, default: 0 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);
