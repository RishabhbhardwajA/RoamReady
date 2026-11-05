const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const validateCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal = 0 } = req.body;
    if (!code) {
      return ApiResponse.error(res, 'Coupon code is required', 400);
    }

    const coupon = await dataStore.findCouponByCode(code);
    if (!coupon) {
      return ApiResponse.error(res, 'Invalid coupon code', 404);
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return ApiResponse.error(res, 'This coupon code has expired', 400);
    }

    if (cartTotal < coupon.minimumSpend) {
      return ApiResponse.error(res, `Minimum cart value of ₹${coupon.minimumSpend} required to use this coupon`, 400);
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.min(Math.round((cartTotal * coupon.discountValue) / 100), coupon.maxDiscount || 1000);
    } else {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    return ApiResponse.success(res, `Coupon applied: Save ₹${discountAmount}!`, {
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
        minimumSpend: coupon.minimumSpend
      }
    });
  } catch (error) {
    next(error);
  }
};

const getActiveCoupons = async (req, res, next) => {
  try {
    const coupons = await dataStore.getAllCoupons();
    return ApiResponse.success(res, 'Active coupons fetched', { coupons });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  validateCoupon,
  getActiveCoupons
};

