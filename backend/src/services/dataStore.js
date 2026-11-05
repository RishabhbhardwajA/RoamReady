const bcrypt = require('bcryptjs');
const { getDBStatus } = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const User = require('../models/User');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Wishlist = require('../models/Wishlist');
const { seedCategories, seedProducts, seedCoupons, seedReviews } = require('./seedData');

// Fallback in-memory state initialized with seed data
let memoryStore = {
  users: [
    {
      _id: 'usr_admin_001',
      name: 'RoamReady Admin',
      email: 'admin@roamready.com',
      password: '', // will be hashed below
      role: 'admin',
      phone: '+91 98765 43210',
      addresses: [
        {
          id: 'addr_1',
          fullName: 'RoamReady HQ',
          phone: '+91 98765 43210',
          street: 'Indiranagar 100ft Road',
          apartment: 'Suite 401',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true
        }
      ],
      createdAt: new Date().toISOString()
    },
    {
      _id: 'usr_demo_002',
      name: 'Rohan Sharma',
      email: 'traveler@roamready.com',
      password: '',
      role: 'customer',
      phone: '+91 91234 56789',
      addresses: [
        {
          id: 'addr_2',
          fullName: 'Rohan Sharma',
          phone: '+91 91234 56789',
          street: 'Bandra West, Hill Road',
          apartment: 'Flat 12B, Sea Crest',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400050',
          country: 'India',
          isDefault: true
        }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  categories: seedCategories.map((c, idx) => ({ ...c, _id: `cat_${idx + 1}` })),
  products: seedProducts.map((p, idx) => ({ ...p, _id: `prod_${idx + 1}`, createdAt: new Date(Date.now() - idx * 86400000).toISOString() })),
  coupons: seedCoupons.map((c, idx) => ({ ...c, _id: `cpn_${idx + 1}` })),
  reviews: seedReviews.map((r, idx) => ({ ...r, _id: `rev_${idx + 1}`, createdAt: new Date(Date.now() - idx * 172800000).toISOString() })),
  orders: [],
  carts: {},
  wishlists: {}
};

// Hash default user passwords on startup synchronously so initial logins succeed immediately
const defaultPasswordHash = bcrypt.hashSync('TravelGear2026!', 10);
memoryStore.users[0].password = defaultPasswordHash;
memoryStore.users[1].password = defaultPasswordHash;

const dataStore = {
  // Category operations
  async findCategories() {
    if (getDBStatus().isConnected) {
      try {
        const cats = await Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean();
        if (cats && cats.length > 0) return cats;
      } catch (e) {
        console.warn('MongoDB query failed, falling back to memoryStore:', e.message);
      }
    }
    return memoryStore.categories;
  },

  async findCategoryBySlug(slug) {
    if (getDBStatus().isConnected) {
      try {
        const cat = await Category.findOne({ slug }).lean();
        if (cat) return cat;
      } catch (e) {}
    }
    return memoryStore.categories.find(c => c.slug === slug) || null;
  },

  // Product operations
  async findProducts({ category, search, sort = 'popularity', minPrice, maxPrice, rating, inStock, limit = 20, page = 1, isTravelKit } = {}) {
    if (getDBStatus().isConnected) {
      try {
        const query = {};
        if (category && category !== 'all') query.categorySlug = category;
        if (isTravelKit !== undefined) query.isTravelKit = isTravelKit;
        if (search) {
          query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $regex: search, $options: 'i' } }
          ];
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
          query.price = {};
          if (minPrice !== undefined) query.price.$gte = Number(minPrice);
          if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
        }
        if (rating) query.rating = { $gte: Number(rating) };
        if (inStock === 'true' || inStock === true) query.stock = { $gt: 0 };

        let sortOption = { isBestseller: -1, rating: -1 };
        if (sort === 'price-low') sortOption = { price: 1 };
        else if (sort === 'price-high') sortOption = { price: -1 };
        else if (sort === 'newest') sortOption = { createdAt: -1 };
        else if (sort === 'rating') sortOption = { rating: -1 };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(Number(limit))
          .lean();

        if (products && products.length > 0) {
          return { products, total, totalPages: Math.ceil(total / limit), currentPage: Number(page) };
        }
      } catch (e) {
        console.warn('MongoDB query failed, using memoryStore:', e.message);
      }
    }

    let filtered = [...memoryStore.products];
    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.categorySlug === category);
    }
    if (isTravelKit !== undefined) {
      filtered = filtered.filter(p => Boolean(p.isTravelKit) === Boolean(isTravelKit));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (minPrice !== undefined) filtered = filtered.filter(p => p.price >= Number(minPrice));
    if (maxPrice !== undefined) filtered = filtered.filter(p => p.price <= Number(maxPrice));
    if (rating) filtered = filtered.filter(p => p.rating >= Number(rating));
    if (inStock === 'true' || inStock === true) filtered = filtered.filter(p => p.stock > 0);

    if (sort === 'price-low') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') filtered.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.rating - a.rating);

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    return {
      products: paginated,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: Number(page)
    };
  },

  async findProductBySlug(slug) {
    if (getDBStatus().isConnected) {
      try {
        const prod = await Product.findOne({ slug }).lean();
        if (prod) return prod;
      } catch (e) {}
    }
    return memoryStore.products.find(p => p.slug === slug) || null;
  },

  async findProductById(id) {
    if (getDBStatus().isConnected) {
      try {
        const prod = await Product.findById(id).lean();
        if (prod) return prod;
      } catch (e) {}
    }
    return memoryStore.products.find(p => p._id.toString() === id.toString()) || null;
  },

  async createProduct(data) {
    if (getDBStatus().isConnected) {
      try {
        const p = await Product.create(data);
        return p.toObject();
      } catch (e) {}
    }
    const newProd = {
      ...data,
      _id: `prod_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    memoryStore.products.unshift(newProd);
    return newProd;
  },

  async updateProduct(id, data) {
    if (getDBStatus().isConnected) {
      try {
        const p = await Product.findByIdAndUpdate(id, data, { new: true }).lean();
        if (p) return p;
      } catch (e) {}
    }
    const idx = memoryStore.products.findIndex(p => p._id.toString() === id.toString());
    if (idx !== -1) {
      memoryStore.products[idx] = { ...memoryStore.products[idx], ...data, updatedAt: new Date().toISOString() };
      return memoryStore.products[idx];
    }
    return null;
  },

  async deleteProduct(id) {
    if (getDBStatus().isConnected) {
      try {
        await Product.findByIdAndDelete(id);
        return true;
      } catch (e) {}
    }
    const initialLen = memoryStore.products.length;
    memoryStore.products = memoryStore.products.filter(p => p._id.toString() !== id.toString());
    return memoryStore.products.length < initialLen;
  },

  // User operations
  async findUserByEmail(email, includePassword = false) {
    const cleanEmail = email.toLowerCase().trim();
    if (getDBStatus().isConnected) {
      try {
        const query = User.findOne({ email: cleanEmail });
        if (includePassword) query.select('+password');
        const user = await query.exec();
        if (user) return user;
      } catch (e) {}
    }
    const user = memoryStore.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) return null;
    if (!includePassword) {
      const { password, ...sanitized } = user;
      return sanitized;
    }
    return user;
  },

  async findUserById(id) {
    if (getDBStatus().isConnected) {
      try {
        const user = await User.findById(id).select('-password').lean();
        if (user) return user;
      } catch (e) {}
    }
    const user = memoryStore.users.find(u => u._id.toString() === id.toString());
    if (!user) return null;
    const { password, ...sanitized } = user;
    return sanitized;
  },

  async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    if (getDBStatus().isConnected) {
      try {
        const user = await User.create({ ...data, password: hashedPassword });
        const obj = user.toObject();
        delete obj.password;
        return obj;
      } catch (e) {}
    }
    const newUser = {
      _id: `usr_${Date.now()}`,
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      role: data.role || 'customer',
      phone: data.phone || '',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    memoryStore.users.push(newUser);
    const { password, ...sanitized } = newUser;
    return sanitized;
  },

  async updateUser(id, updateData) {
    if (getDBStatus().isConnected) {
      try {
        const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password').lean();
        if (user) return user;
      } catch (e) {}
    }
    const idx = memoryStore.users.findIndex(u => u._id.toString() === id.toString());
    if (idx !== -1) {
      memoryStore.users[idx] = { ...memoryStore.users[idx], ...updateData, updatedAt: new Date().toISOString() };
      const { password, ...sanitized } = memoryStore.users[idx];
      return sanitized;
    }
    return null;
  },

  async getAllUsers() {
    if (getDBStatus().isConnected) {
      try {
        const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
        if (users && users.length > 0) return users;
      } catch (e) {}
    }
    return memoryStore.users.map(({ password, ...u }) => u);
  },

  // Cart operations
  async getCart(cartKey) {
    let cart = memoryStore.carts[cartKey];
    if (!cart) {
      cart = {
        key: cartKey,
        items: [],
        appliedCoupon: null,
        subtotal: 0,
        discount: 0,
        shipping: 0,
        total: 0
      };
      memoryStore.carts[cartKey] = cart;
    }
    return cart;
  },

  async saveCart(cartKey, cartData) {
    // recalculate totals
    const subtotal = (cartData.items || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
    let discount = 0;

    if (cartData.appliedCoupon) {
      if (cartData.appliedCoupon.discountType === 'percentage') {
        discount = Math.min(Math.round((subtotal * cartData.appliedCoupon.discountValue) / 100), cartData.appliedCoupon.maxDiscount || 1000);
      } else {
        discount = Math.min(cartData.appliedCoupon.discountValue || 0, subtotal);
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    const updated = {
      key: cartKey,
      items: cartData.items || [],
      appliedCoupon: cartData.appliedCoupon || null,
      subtotal,
      discount,
      shipping,
      total,
      updatedAt: new Date().toISOString()
    };

    memoryStore.carts[cartKey] = updated;
    return updated;
  },

  async clearCart(cartKey) {
    memoryStore.carts[cartKey] = {
      key: cartKey,
      items: [],
      appliedCoupon: null,
      subtotal: 0,
      discount: 0,
      shipping: 0,
      total: 0
    };
    return memoryStore.carts[cartKey];
  },

  // Order operations
  async createOrder(orderData) {
    const orderNumber = `RR-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      _id: `ord_${Date.now()}`,
      orderNumber,
      orderStatus: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tracking: {
        carrier: 'BlueDart Air Express',
        trackingNumber: `BD-${Math.floor(100000000 + Math.random() * 900000000)}`,
        estimatedDelivery: new Date(Date.now() + 4 * 86400000).toISOString(),
        timeline: [
          { status: 'Order Placed', timestamp: new Date().toISOString(), note: 'Payment verified successfully.' },
          { status: 'Processing', timestamp: new Date().toISOString(), note: 'Allocated to Bengaluru Fulfillment Hub.' }
        ]
      },
      ...orderData
    };

    if (getDBStatus().isConnected) {
      try {
        const orderDoc = await Order.create(newOrder);
        return orderDoc.toObject();
      } catch (e) {}
    }

    memoryStore.orders.unshift(newOrder);

    // Deduct stock
    for (const item of newOrder.items || []) {
      const prod = memoryStore.products.find(p => p.slug === item.slug || p._id.toString() === item.productIdString);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    }

    return newOrder;
  },

  async findOrdersByUser(userId) {
    if (getDBStatus().isConnected) {
      try {
        const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
        if (orders && orders.length > 0) return orders;
      } catch (e) {}
    }
    return memoryStore.orders.filter(o => o.user && o.user.toString() === userId.toString());
  },

  async findOrderByIdOrNumber(idOrNumber) {
    if (getDBStatus().isConnected) {
      try {
        const order = await Order.findOne({
          $or: [{ orderNumber: idOrNumber }, { _id: idOrNumber }]
        }).lean();
        if (order) return order;
      } catch (e) {}
    }
    return memoryStore.orders.find(o => o.orderNumber === idOrNumber || o._id.toString() === idOrNumber.toString()) || null;
  },

  async getAllOrders() {
    if (getDBStatus().isConnected) {
      try {
        const orders = await Order.find().sort({ createdAt: -1 }).lean();
        if (orders && orders.length > 0) return orders;
      } catch (e) {}
    }
    return memoryStore.orders;
  },

  async updateOrderStatus(id, status, note = '') {
    const order = await this.findOrderByIdOrNumber(id);
    if (!order) return null;

    if (getDBStatus().isConnected) {
      try {
        const updated = await Order.findByIdAndUpdate(
          order._id,
          {
            $set: { orderStatus: status, updatedAt: new Date() },
            $push: { 'tracking.timeline': { status, timestamp: new Date(), note: note || `Status updated to ${status}` } }
          },
          { new: true }
        ).lean();
        if (updated) return updated;
      } catch (e) {}
    }

    order.orderStatus = status;
    order.updatedAt = new Date().toISOString();
    if (order.tracking && order.tracking.timeline) {
      order.tracking.timeline.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Status updated to ${status}`
      });
    }
    return order;
  },

  // Review operations
  async findReviewsByProduct(productSlug) {
    if (getDBStatus().isConnected) {
      try {
        const reviews = await Review.find({ productSlug, status: 'approved' }).sort({ createdAt: -1 }).lean();
        if (reviews && reviews.length > 0) return reviews;
      } catch (e) {}
    }
    return memoryStore.reviews.filter(r => r.productSlug === productSlug && r.status === 'approved');
  },

  async getAllReviews() {
    if (getDBStatus().isConnected) {
      try {
        const reviews = await Review.find().sort({ createdAt: -1 }).lean();
        if (reviews && reviews.length > 0) return reviews;
      } catch (e) {}
    }
    return memoryStore.reviews;
  },

  async createReview(data) {
    const newReview = {
      _id: `rev_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'approved',
      helpfulVotes: 0,
      ...data
    };

    if (getDBStatus().isConnected) {
      try {
        const rev = await Review.create(newReview);
        return rev.toObject();
      } catch (e) {}
    }

    memoryStore.reviews.unshift(newReview);

    // Update product rating
    const prodReviews = memoryStore.reviews.filter(r => r.productSlug === data.productSlug);
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const prod = memoryStore.products.find(p => p.slug === data.productSlug);
    if (prod) {
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    return newReview;
  },

  // Coupon operations
  async findCouponByCode(code) {
    const cleanCode = code.toUpperCase().trim();
    if (getDBStatus().isConnected) {
      try {
        const cpn = await Coupon.findOne({ code: cleanCode, isActive: true }).lean();
        if (cpn) return cpn;
      } catch (e) {}
    }
    return memoryStore.coupons.find(c => c.code === cleanCode && c.isActive) || null;
  },

  async getAllCoupons() {
    if (getDBStatus().isConnected) {
      try {
        const cpns = await Coupon.find().sort({ createdAt: -1 }).lean();
        if (cpns && cpns.length > 0) return cpns;
      } catch (e) {}
    }
    return memoryStore.coupons;
  },

  async createCoupon(data) {
    const newCoupon = {
      _id: `cpn_${Date.now()}`,
      isActive: true,
      usageCount: 0,
      createdAt: new Date().toISOString(),
      ...data
    };
    if (getDBStatus().isConnected) {
      try {
        const c = await Coupon.create(newCoupon);
        return c.toObject();
      } catch (e) {}
    }
    memoryStore.coupons.push(newCoupon);
    return newCoupon;
  },

  // Wishlist operations
  async getWishlist(userId) {
    const list = memoryStore.wishlists[userId] || [];
    return list.map(slugOrId => memoryStore.products.find(p => p.slug === slugOrId || p._id.toString() === slugOrId.toString())).filter(Boolean);
  },

  async toggleWishlist(userId, productIdOrSlug) {
    if (!memoryStore.wishlists[userId]) {
      memoryStore.wishlists[userId] = [];
    }
    const idx = memoryStore.wishlists[userId].indexOf(productIdOrSlug);
    let isAdded = false;
    if (idx > -1) {
      memoryStore.wishlists[userId].splice(idx, 1);
      isAdded = false;
    } else {
      memoryStore.wishlists[userId].push(productIdOrSlug);
      isAdded = true;
    }
    return { isAdded, count: memoryStore.wishlists[userId].length };
  },

  // Admin metrics
  async getAdminMetrics() {
    const orders = await this.getAllOrders();
    const products = memoryStore.products;
    const users = await this.getAllUsers();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.pricing ? o.pricing.total : 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending' || o.orderStatus === 'confirmed').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
    const lowStockProducts = products.filter(p => p.stock < 20);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalCustomers: users.filter(u => u.role !== 'admin').length,
      totalProducts: products.length,
      pendingOrders,
      completedOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts: lowStockProducts.slice(0, 5),
      recentOrders: orders.slice(0, 5)
    };
  }
};

module.exports = dataStore;
