const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');
const User = require('../models/User');
const { seedCategories, seedProducts, seedCoupons, seedReviews } = require('./seedData');

const ensureDatabaseSeeded = async () => {
  try {
    // 1. Categories
    const categoryCount = await Category.countDocuments();
    let categoriesMap = {};
    if (categoryCount === 0) {
      console.log('[RoamReady Seed] No categories found in MongoDB. Seeding initial categories...');
      const createdCats = await Category.insertMany(seedCategories);
      createdCats.forEach(c => {
        categoriesMap[c.slug] = c._id;
      });
      console.log(`[RoamReady Seed] Successfully seeded ${createdCats.length} categories.`);
    } else {
      const existingCats = await Category.find({}, 'slug _id').lean();
      existingCats.forEach(c => {
        categoriesMap[c.slug] = c._id;
      });
    }

    // 2. Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log('[RoamReady Seed] No products found in MongoDB. Seeding initial products...');
      const productsToInsert = seedProducts.map(p => {
        const prod = { ...p };
        if (categoriesMap[prod.categorySlug]) {
          prod.category = categoriesMap[prod.categorySlug];
        }
        return prod;
      });

      const createdProducts = await Product.insertMany(productsToInsert);
      console.log(`[RoamReady Seed] Successfully seeded ${createdProducts.length} products into MongoDB Atlas.`);

      // Update category productCounts
      for (const catSlug of Object.keys(categoriesMap)) {
        const count = await Product.countDocuments({ categorySlug: catSlug });
        await Category.updateOne({ slug: catSlug }, { productCount: count });
      }
    }

    // 3. Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      console.log('[RoamReady Seed] Seeding initial coupons...');
      await Coupon.insertMany(seedCoupons);
      console.log(`[RoamReady Seed] Successfully seeded ${seedCoupons.length} coupons.`);
    }

    // 4. Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('[RoamReady Seed] Seeding initial reviews...');
      const allDbProducts = await Product.find({}, '_id slug').lean();
      if (allDbProducts.length > 0) {
        const reviewsToInsert = [];
        seedReviews.forEach((rev, idx) => {
          const targetProd = allDbProducts.find(p => p.slug === rev.productSlug) || allDbProducts[idx % allDbProducts.length];
          if (targetProd) {
            reviewsToInsert.push({
              ...rev,
              product: targetProd._id,
              productSlug: targetProd.slug
            });
          }
        });
        if (reviewsToInsert.length > 0) {
          await Review.insertMany(reviewsToInsert);
          console.log(`[RoamReady Seed] Successfully seeded ${reviewsToInsert.length} reviews.`);
        }
      }
    }

    console.log('[RoamReady Seed] Database seeding and verification check complete.');
  } catch (error) {
    console.error('[RoamReady Seed] Error ensuring database is seeded:', error.message);
  }
};

// Standalone execution support
if (require.main === module) {
  const env = require('../config/env');
  mongoose.connect(env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
    .then(async () => {
      console.log(`[RoamReady Seed] Connected to MongoDB: ${env.MONGODB_URI}`);
      await ensureDatabaseSeeded();
      process.exit(0);
    })
    .catch(err => {
      console.error('[RoamReady Seed] Failed to connect to MongoDB:', err.message);
      process.exit(1);
    });
}

module.exports = {
  ensureDatabaseSeeded
};
