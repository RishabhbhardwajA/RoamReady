const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');
const env = require('../config/env');

const createOrder = async (req, res, next) => {
  try {
    const { customerDetails, shippingAddress, paymentMethod, couponCode, items: directItems } = req.body;

    let orderItems = [];
    let subtotal = 0;
    const cartKey = req.user ? `user_${req.user._id}` : req.headers['x-session-id'] || 'guest_default_session';

    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      orderItems = directItems;
      subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else {
      const cart = await dataStore.getCart(cartKey);
      if (!cart || cart.items.length === 0) {
        return ApiResponse.error(res, 'Cannot create an order with an empty cart', 400);
      }
      orderItems = cart.items;
      subtotal = cart.subtotal;
    }

    // Verify stock availability
    for (const item of orderItems) {
      const product = await dataStore.findProductBySlug(item.slug);
      if (!product) {
        return ApiResponse.error(res, `Product ${item.title} no longer exists`, 400);
      }
      if (product.stock < item.quantity) {
        return ApiResponse.error(res, `Insufficient stock for ${item.title}. Available: ${product.stock}`, 400);
      }
    }

    // Shipping fee calculation
    const shipping = subtotal > 999 ? 0 : 99;

    // Coupon discount calculation
    let discount = 0;
    let appliedCoupon = null;
    const codeToTest = couponCode || (await dataStore.getCart(cartKey))?.appliedCoupon?.code;
    if (codeToTest) {
      const coupon = await dataStore.findCouponByCode(codeToTest);
      if (coupon && subtotal >= coupon.minimumSpend) {
        appliedCoupon = coupon;
        if (coupon.discountType === 'percentage') {
          discount = Math.min(Math.round((subtotal * coupon.discountValue) / 100), coupon.maxDiscount || 1000);
        } else {
          discount = Math.min(coupon.discountValue, subtotal);
        }
      }
    }

    const total = Math.max(0, subtotal - discount + shipping);

    // Razorpay order simulation / test mode
    const isDemoMode = true;
    const razorpayOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    const orderData = {
      user: req.user ? req.user._id : null,
      customerDetails: {
        name: customerDetails.name,
        email: customerDetails.email.toLowerCase().trim(),
        phone: customerDetails.phone
      },
      shippingAddress,
      items: orderItems,
      pricing: {
        subtotal,
        discount,
        shipping,
        total
      },
      couponApplied: appliedCoupon ? { code: appliedCoupon.code, discountAmount: discount } : null,
      payment: {
        method: paymentMethod,
        status: paymentMethod === 'cod' ? 'pending' : 'completed',
        razorpayOrderId,
        razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 14)}`,
        isDemoMode
      }
    };

    const createdOrder = await dataStore.createOrder(orderData);

    // Clear cart after successful order creation
    await dataStore.clearCart(cartKey);

    return ApiResponse.success(res, 'Order placed successfully!', {
      order: createdOrder,
      razorpay: {
        keyId: env.RAZORPAY_KEY_ID,
        amount: total * 100, // in paise
        currency: 'INR',
        orderId: razorpayOrderId,
        isDemoMode: true
      }
    }, 201);
  } catch (error) {
    next(error);
  }
};

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await dataStore.findOrdersByUser(req.user._id);
    return ApiResponse.success(res, 'Orders fetched', { orders });
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await dataStore.findOrderByIdOrNumber(id);

    if (!order) {
      return ApiResponse.error(res, 'Order not found', 404);
    }

    // If authenticated customer, ensure order belongs to them (or admin)
    if (req.user && req.user.role !== 'admin' && order.user && order.user.toString() !== req.user._id.toString()) {
      return ApiResponse.error(res, 'Unauthorized access to this order', 403);
    }

    return ApiResponse.success(res, 'Order details fetched', { order });
  } catch (error) {
    next(error);
  }
};

const trackOrder = async (req, res, next) => {
  try {
    const { orderNumber, phoneOrEmail } = req.body;
    if (!orderNumber) {
      return ApiResponse.error(res, 'Order number is required for tracking', 400);
    }

    const order = await dataStore.findOrderByIdOrNumber(orderNumber);
    if (!order) {
      return ApiResponse.error(res, 'No order found matching this reference number', 404);
    }

    if (phoneOrEmail) {
      const matchEmail = order.customerDetails.email.toLowerCase() === phoneOrEmail.toLowerCase().trim();
      const matchPhone = order.customerDetails.phone.includes(phoneOrEmail.trim());
      if (!matchEmail && !matchPhone) {
        return ApiResponse.error(res, 'Order number and customer details do not match', 400);
      }
    }

    return ApiResponse.success(res, 'Tracking details fetched', {
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      tracking: order.tracking,
      estimatedDelivery: order.tracking?.estimatedDelivery,
      shippingAddress: {
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        postalCode: order.shippingAddress.postalCode
      },
      itemCount: order.items.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  trackOrder
};
