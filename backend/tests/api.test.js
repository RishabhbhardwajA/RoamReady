/**
 * Automated Test Suite for RoamReady Travel Gear Backend API
 */
const http = require('http');
const app = require('../src/app');

let passedTests = 0;
let failedTests = 0;

const assert = (condition, message) => {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failedTests++;
  }
};

const sendRequest = (method, path, body = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const req = new http.IncomingMessage();
    req.method = method;
    req.url = path;
    req.headers = { host: 'localhost:5000', 'content-type': 'application/json', ...headers };
    req.socket = { remoteAddress: '127.0.0.1' };

    if (body) {
      req.body = body;
    }

    const res = new http.ServerResponse(req);
    let raw = '';
    res.write = (chunk) => { raw += chunk; return true; };
    res.end = (chunk) => {
      if (chunk) raw += chunk;
      try {
        resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null });
      } catch (e) {
        resolve({ status: res.statusCode, raw });
      }
    };

    app(req, res);
  });
};

async function runTests() {
  console.log('\n======================================================');
  console.log('🚀 Running RoamReady Automated API Test Suite');
  console.log('======================================================\n');

  // 1. Health check
  console.log('Test Group 1: Health & System Diagnostics');
  const healthRes = await sendRequest('GET', '/api/health');
  assert(healthRes.status === 200, 'Health endpoint responds with 200 OK');
  assert(healthRes.body.success === true, 'Health check indicates operational system');
  assert(Boolean(healthRes.body.database), 'Database status is reported');

  // 2. Categories
  console.log('\nTest Group 2: Categories');
  const catRes = await sendRequest('GET', '/api/categories');
  assert(catRes.status === 200, 'Categories endpoint returns 200');
  assert(catRes.body.data.categories.length >= 5, 'Contains at least 5 initial categories');

  // 3. Products Catalog
  console.log('\nTest Group 3: Product Catalog & Filters');
  const prodRes = await sendRequest('GET', '/api/products');
  assert(prodRes.status === 200, 'Products listing returns 200');
  assert(prodRes.body.data.length > 0, 'Products array is populated');

  const tsaRes = await sendRequest('GET', '/api/products?category=tsa-locks');
  assert(tsaRes.status === 200, 'Category filtering works');
  assert(tsaRes.body.data.every(p => p.categorySlug === 'tsa-locks'), 'Filtered items match category slug');

  // 4. Product Details
  console.log('\nTest Group 4: Product Details & Reviews');
  const firstProd = prodRes.body.data[0];
  const detailRes = await sendRequest('GET', `/api/products/${firstProd.slug}`);
  assert(detailRes.status === 200, 'Product detail returns 200');
  assert(detailRes.body.data.product.slug === firstProd.slug, 'Product details match requested slug');
  assert(detailRes.body.data.product.specifications.material !== undefined, 'Specifications material present');

  // 5. Comparison Engine
  console.log('\nTest Group 5: Product Comparison Tool');
  const compRes = await sendRequest('POST', '/api/products/compare', {
    slugs: ['roamready-aerolock-pro-4-digit-tsa', 'roamready-privacyshield-aluminum-luggage-tag']
  });
  assert(compRes.status === 200, 'Compare endpoint returns 200');
  assert(compRes.body.data.products.length === 2, 'Returns comparison for both items');
  assert(compRes.body.data.attributes.length >= 10, 'Comparison matrix contains 10+ travel specs');

  // 6. PIN Code Logistics Estimator
  console.log('\nTest Group 6: PIN Code Delivery Estimator');
  const pinRes = await sendRequest('GET', '/api/products/check-pincode/560038');
  assert(pinRes.status === 200, 'PIN code 560038 returns 200');
  assert(pinRes.body.data.isServiceable === true, 'Bengaluru PIN code is serviceable');
  assert(Boolean(pinRes.body.data.estimatedDeliveryDate), 'Estimated delivery date calculated');

  // 7. Authentication
  console.log('\nTest Group 7: Customer & Admin Authentication');
  const loginRes = await sendRequest('POST', '/api/auth/login', {
    email: 'traveler@roamready.com',
    password: 'TravelGear2026!'
  });
  assert(loginRes.status === 200, 'Demo Customer login succeeds');
  assert(Boolean(loginRes.body.data.token), 'JWT authentication token received');
  const customerToken = loginRes.body.data.token;

  const adminLoginRes = await sendRequest('POST', '/api/auth/login', {
    email: 'admin@roamready.com',
    password: 'TravelGear2026!'
  });
  assert(adminLoginRes.status === 200, 'Store Admin login succeeds');
  assert(adminLoginRes.body.data.user.role === 'admin', 'Admin role verified');
  const adminToken = adminLoginRes.body.data.token;

  // 8. Cart Operations
  console.log('\nTest Group 8: Shopping Cart & Coupons');
  const sessionHeaders = { 'x-session-id': 'test_suite_session_1' };
  const addCartRes = await sendRequest('POST', '/api/cart/items', {
    productSlug: firstProd.slug,
    variantId: firstProd.variants[0].id,
    quantity: 2
  }, sessionHeaders);
  assert(addCartRes.status === 200, 'Added item to cart');
  assert(addCartRes.body.data.cart.items.length === 1, 'Cart contains 1 line item');

  // Apply Coupon
  const couponRes = await sendRequest('POST', '/api/cart/coupon', {
    code: 'WELCOME10'
  }, sessionHeaders);
  assert(couponRes.status === 200, 'Coupon WELCOME10 applied successfully');
  assert(couponRes.body.data.cart.discount > 0, 'Discount correctly calculated');

  // 9. Order Checkout
  console.log('\nTest Group 9: Multi-Step Order Placement');
  const orderRes = await sendRequest('POST', '/api/orders', {
    customerDetails: {
      name: 'Test Traveler',
      email: 'tester@roamready.com',
      phone: '9876543210'
    },
    shippingAddress: {
      fullName: 'Test Traveler',
      phone: '9876543210',
      street: 'Indiranagar 100ft Rd',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038'
    },
    paymentMethod: 'upi',
    couponCode: 'WELCOME10'
  }, sessionHeaders);
  assert(orderRes.status === 201, 'Order created successfully with status 201');
  assert(Boolean(orderRes.body.data.order.orderNumber), 'Order Number allocated');
  assert(Boolean(orderRes.body.data.order.tracking.trackingNumber), 'BlueDart tracking number generated');

  // 10. Admin Dashboard Access
  console.log('\nTest Group 10: Admin Dashboard & Permissions');
  const metricsRes = await sendRequest('GET', '/api/admin/metrics', null, {
    authorization: `Bearer ${adminToken}`
  });
  assert(metricsRes.status === 200, 'Admin can fetch dashboard metrics');
  assert(metricsRes.body.data.metrics.totalRevenue >= 0, 'Total revenue metric computed');

  // Test Admin Protection with non-admin token
  const forbiddenRes = await sendRequest('GET', '/api/admin/metrics', null, {
    authorization: `Bearer ${customerToken}`
  });
  assert(forbiddenRes.status === 403, 'Customer correctly forbidden from accessing admin metrics (403)');

  console.log('\n======================================================');
  console.log(`📊 Test Results: ${passedTests} Passed, ${failedTests} Failed`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test Suite encountered fatal error:', err);
  process.exit(1);
});
