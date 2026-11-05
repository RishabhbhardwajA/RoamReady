const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const getCartKey = (req) => {
  if (req.user && req.user._id) {
    return `user_${req.user._id}`;
  }
  return req.headers['x-session-id'] || req.cookies?.sessionId || 'guest_default_session';
};

const getCart = async (req, res, next) => {
  try {
    const key = getCartKey(req);
    const cart = await dataStore.getCart(key);
    return ApiResponse.success(res, 'Cart fetched', { cart });
  } catch (error) {
    next(error);
  }
};

const addItem = async (req, res, next) => {
  try {
    const { productSlug, variantId, quantity = 1 } = req.body;
    const key = getCartKey(req);

    const product = await dataStore.findProductBySlug(productSlug);
    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }

    const variant = (product.variants || []).find(v => v.id === variantId) || product.variants?.[0] || {
      id: 'default',
      name: 'Standard',
      sku: product.sku,
      colorName: 'Standard',
      image: product.thumbnail,
      stockCount: product.stock
    };

    if (quantity > (variant.stockCount || product.stock)) {
      return ApiResponse.error(res, `Cannot add more than available stock (${variant.stockCount || product.stock} units)`, 400);
    }

    const cart = await dataStore.getCart(key);
    const existingIndex = cart.items.findIndex(i => i.slug === product.slug && i.variantId === variant.id);

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > (variant.stockCount || product.stock)) {
        return ApiResponse.error(res, `Exceeds available inventory of ${variant.stockCount || product.stock}`, 400);
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: product._id,
        productIdString: product._id.toString(),
        slug: product.slug,
        title: product.title,
        sku: variant.sku || product.sku,
        variantId: variant.id,
        price: product.price + (variant.additionalPrice || 0),
        image: variant.image || product.thumbnail,
        colorName: variant.colorName || 'Standard',
        size: variant.size || 'Standard',
        quantity: Number(quantity)
      });
    }

    const updated = await dataStore.saveCart(key, cart);
    return ApiResponse.success(res, 'Item added to cart', { cart: updated });
  } catch (error) {
    next(error);
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const { variantId, slug, quantity } = req.body;
    const key = getCartKey(req);
    const cart = await dataStore.getCart(key);

    const itemIndex = cart.items.findIndex(i => i.variantId === variantId && (!slug || i.slug === slug));
    if (itemIndex === -1) {
      return ApiResponse.error(res, 'Item not found in cart', 404);
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = Number(quantity);
    }

    const updated = await dataStore.saveCart(key, cart);
    return ApiResponse.success(res, 'Cart updated', { cart: updated });
  } catch (error) {
    next(error);
  }
};

const removeItem = async (req, res, next) => {
  try {
    const { variantId } = req.params;
    const key = getCartKey(req);
    const cart = await dataStore.getCart(key);

    cart.items = cart.items.filter(i => i.variantId !== variantId);

    const updated = await dataStore.saveCart(key, cart);
    return ApiResponse.success(res, 'Item removed from cart', { cart: updated });
  } catch (error) {
    next(error);
  }
};

const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return ApiResponse.error(res, 'Please enter a coupon code', 400);
    }

    const key = getCartKey(req);
    const cart = await dataStore.getCart(key);

    if (cart.items.length === 0) {
      return ApiResponse.error(res, 'Your cart is empty', 400);
    }

    const coupon = await dataStore.findCouponByCode(code);
    if (!coupon) {
      return ApiResponse.error(res, 'Invalid or expired coupon code', 400);
    }

    if (cart.subtotal < coupon.minimumSpend) {
      return ApiResponse.error(res, `This coupon requires a minimum cart value of ₹${coupon.minimumSpend}`, 400);
    }

    cart.appliedCoupon = coupon;
    const updated = await dataStore.saveCart(key, cart);

    return ApiResponse.success(res, `Coupon '${coupon.code}' applied successfully!`, { cart: updated });
  } catch (error) {
    next(error);
  }
};

const removeCoupon = async (req, res, next) => {
  try {
    const key = getCartKey(req);
    const cart = await dataStore.getCart(key);
    cart.appliedCoupon = null;

    const updated = await dataStore.saveCart(key, cart);
    return ApiResponse.success(res, 'Coupon removed', { cart: updated });
  } catch (error) {
    next(error);
  }
};

const clearCart = async (req, res, next) => {
  try {
    const key = getCartKey(req);
    const cleared = await dataStore.clearCart(key);
    return ApiResponse.success(res, 'Cart cleared', { cart: cleared });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  applyCoupon,
  removeCoupon,
  clearCart
};
