const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true },
  colorName: { type: String, required: true },
  colorHex: { type: String, required: true },
  size: { type: String, default: 'Standard' },
  image: { type: String, required: true },
  stockCount: { type: Number, default: 25 },
  inStock: { type: Boolean, default: true },
  additionalPrice: { type: Number, default: 0 }
}, { _id: false });

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
  categorySlug: { type: String, required: true, lowercase: true },
  categoryName: { type: String, required: true },
  brand: { type: String, default: 'RoamReady' },
  images: [{ type: String, required: true }],
  thumbnail: { type: String, required: true },
  rating: { type: Number, default: 4.8, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  stock: { type: Number, required: true, default: 50 },
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  badge: { type: String, default: '' },
  tags: [{ type: String }],
  variants: [variantSchema],
  specifications: {
    material: { type: String, default: 'Reinforced Ballistic Nylon / Zinc Alloy' },
    dimensions: { type: String, default: 'N/A' },
    weight: { type: String, default: 'N/A' },
    capacity: { type: String, default: 'N/A' },
    lockType: { type: String, default: 'N/A' },
    combinationDigits: { type: Number, default: null },
    tsaApproved: { type: Boolean, default: false },
    waterResistance: { type: String, default: 'Water-Resistant Coating' },
    compressionMechanism: { type: String, default: 'N/A' },
    warranty: { type: String, default: '2-Year International Warranty' },
    originCountry: { type: String, default: 'India' },
    closureType: { type: String, default: 'Heavy-Duty YKK Reverse Zipper' }
  },
  luggageCompatibility: [{ type: String }],
  faq: [faqSchema],
  isTravelKit: { type: Boolean, default: false },
  bundleItems: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    productSlug: String,
    title: String,
    quantity: { type: Number, default: 1 }
  }]
}, {
  timestamps: true
});

productSchema.index({ title: 'text', description: 'text', categorySlug: 1, tags: 1 });

module.exports = mongoose.model('Product', productSchema);
