const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const getDashboardStats = async (req, res, next) => {
  try {
    const metrics = await dataStore.getAdminMetrics();
    return ApiResponse.success(res, 'Admin metrics fetched', { metrics });
  } catch (error) {
    next(error);
  }
};

const getAdminProducts = async (req, res, next) => {
  try {
    const result = await dataStore.findProducts({ limit: 100 });
    return ApiResponse.success(res, 'All products fetched for admin', { products: result.products });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    if (!productData.title || !productData.price || !productData.categorySlug) {
      return ApiResponse.error(res, 'Title, price, and category are required', 400);
    }

    if (!productData.slug) {
      productData.slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (!productData.sku) {
      productData.sku = `RR-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    }

    const created = await dataStore.createProduct(productData);
    return ApiResponse.success(res, 'Product created successfully', { product: created }, 201);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await dataStore.updateProduct(id, req.body);
    if (!updated) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    return ApiResponse.success(res, 'Product updated successfully', { product: updated });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await dataStore.deleteProduct(id);
    if (!deleted) {
      return ApiResponse.error(res, 'Product not found', 404);
    }
    return ApiResponse.success(res, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getAdminOrders = async (req, res, next) => {
  try {
    const orders = await dataStore.getAllOrders();
    return ApiResponse.success(res, 'All orders fetched', { orders });
  } catch (error) {
    next(error);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    const updatedOrder = await dataStore.updateOrderStatus(id, status, note);
    if (!updatedOrder) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    return ApiResponse.success(res, `Order status updated to ${status}`, { order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

const getAdminCustomers = async (req, res, next) => {
  try {
    const users = await dataStore.getAllUsers();
    return ApiResponse.success(res, 'Customer list fetched', { customers: users });
  } catch (error) {
    next(error);
  }
};

const getAdminCoupons = async (req, res, next) => {
  try {
    const coupons = await dataStore.getAllCoupons();
    return ApiResponse.success(res, 'Coupons fetched', { coupons });
  } catch (error) {
    next(error);
  }
};

const createCoupon = async (req, res, next) => {
  try {
    const couponData = req.body;
    if (!couponData.code || !couponData.discountValue) {
      return ApiResponse.error(res, 'Code and discount value are required', 400);
    }

    const created = await dataStore.createCoupon(couponData);
    return ApiResponse.success(res, 'Coupon created successfully', { coupon: created }, 201);
  } catch (error) {
    next(error);
  }
};

const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await dataStore.getAllReviews();
    return ApiResponse.success(res, 'Reviews fetched', { reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminOrders,
  updateOrderStatus,
  getAdminCustomers,
  getAdminCoupons,
  createCoupon,
  getAdminReviews
};
