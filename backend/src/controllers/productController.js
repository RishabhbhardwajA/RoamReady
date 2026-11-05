const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const getProducts = async (req, res, next) => {
  try {
    const { category, search, sort, minPrice, maxPrice, rating, inStock, limit = 12, page = 1, isTravelKit } = req.query;

    const result = await dataStore.findProducts({
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      rating,
      inStock,
      limit,
      page,
      ...(isTravelKit !== undefined && { isTravelKit: isTravelKit === 'true' })
    });

    return ApiResponse.paginated(res, 'Products fetched successfully', result.products, {
      total: result.total,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      limit: Number(limit)
    });
  } catch (error) {
    next(error);
  }
};

const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await dataStore.findProductBySlug(slug);

    if (!product) {
      return ApiResponse.error(res, 'Product not found', 404);
    }

    // Get related products in the same category
    const relatedResult = await dataStore.findProducts({
      category: product.categorySlug,
      limit: 4
    });
    const relatedProducts = (relatedResult.products || []).filter(p => p.slug !== product.slug).slice(0, 3);

    // Get reviews
    const reviews = await dataStore.findReviewsByProduct(product.slug);

    return ApiResponse.success(res, 'Product details fetched successfully', {
      product,
      relatedProducts,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

const getFeaturedProducts = async (req, res, next) => {
  try {
    const bestsellersResult = await dataStore.findProducts({ sort: 'popularity', limit: 8 });
    const newArrivalsResult = await dataStore.findProducts({ sort: 'newest', limit: 6 });
    const travelKitsResult = await dataStore.findProducts({ isTravelKit: true, limit: 4 });

    return ApiResponse.success(res, 'Featured sections fetched', {
      bestsellers: bestsellersResult.products,
      newArrivals: newArrivalsResult.products,
      travelKits: travelKitsResult.products
    });
  } catch (error) {
    next(error);
  }
};

const getTravelKits = async (req, res, next) => {
  try {
    const kitsResult = await dataStore.findProducts({ isTravelKit: true, limit: 10 });
    return ApiResponse.success(res, 'Travel kits fetched', { kits: kitsResult.products });
  } catch (error) {
    next(error);
  }
};

const compareProducts = async (req, res, next) => {
  try {
    const { slugs } = req.body;
    if (!slugs || !Array.isArray(slugs) || slugs.length === 0) {
      return ApiResponse.error(res, 'Please provide an array of product slugs to compare', 400);
    }

    const products = [];
    for (const slug of slugs.slice(0, 4)) {
      const prod = await dataStore.findProductBySlug(slug);
      if (prod) products.push(prod);
    }

    const comparisonMatrix = {
      attributes: [
        { key: 'categoryName', label: 'Category' },
        { key: 'price', label: 'Price (INR)', format: 'currency' },
        { key: 'originalPrice', label: 'MRP (INR)', format: 'currency' },
        { key: 'rating', label: 'Customer Rating', format: 'rating' },
        { key: 'material', label: 'Fabric / Alloy Material', path: 'specifications.material' },
        { key: 'dimensions', label: 'Dimensions', path: 'specifications.dimensions' },
        { key: 'weight', label: 'Weight', path: 'specifications.weight' },
        { key: 'capacity', label: 'Capacity', path: 'specifications.capacity' },
        { key: 'tsaApproved', label: 'TSA Certified', path: 'specifications.tsaApproved', format: 'boolean' },
        { key: 'waterResistance', label: 'Water Repellency', path: 'specifications.waterResistance' },
        { key: 'warranty', label: 'Warranty', path: 'specifications.warranty' },
        { key: 'luggageCompatibility', label: 'Suitcase Compatibility', format: 'array' }
      ],
      products
    };

    return ApiResponse.success(res, 'Comparison matrix generated', comparisonMatrix);
  } catch (error) {
    next(error);
  }
};

const smartTravelFinder = async (req, res, next) => {
  try {
    const { tripDuration, travelStyle, baggageType } = req.body;

    // Logic for recommendation
    let recommendedSlug = 'roamready-compresspack-elite-6-piece-set';
    let bundleRecommendation = 'roamready-international-explorer-bundle';

    if (tripDuration === 'weekend') {
      recommendedSlug = 'roamready-voyager-packable-40l-duffel';
      bundleRecommendation = 'roamready-weekend-escape-duo';
    } else if (travelStyle === 'business') {
      recommendedSlug = 'roamready-aerolock-pro-4-digit-tsa';
      bundleRecommendation = 'roamready-international-explorer-bundle';
    } else if (tripDuration === 'international' || travelStyle === 'longhaul') {
      recommendedSlug = 'roamready-crossguard-heavy-duty-strap-tsa-lock';
      bundleRecommendation = 'roamready-international-explorer-bundle';
    }

    const recommendedProduct = await dataStore.findProductBySlug(recommendedSlug);
    const recommendedBundle = await dataStore.findProductBySlug(bundleRecommendation);

    return ApiResponse.success(res, 'Smart travel recommendations generated', {
      tripDuration,
      travelStyle,
      baggageType,
      primaryRecommendation: recommendedProduct,
      recommendedBundle: recommendedBundle,
      packingTip: tripDuration === 'weekend'
        ? 'Roll clothes instead of folding to maximize your 40L duffel space and keep shoes in a separate compartment.'
        : 'Ensure your TSA combination lock is locked and tension strap is snug around luggage seams before checking in.'
    });
  } catch (error) {
    next(error);
  }
};

const checkDeliveryPincode = async (req, res, next) => {
  try {
    const { pincode } = req.params;
    if (!pincode || !/^\d{6}$/.test(pincode)) {
      return ApiResponse.error(res, 'Please enter a valid 6-digit Indian PIN code', 400);
    }

    const firstDigit = pincode[0];
    let daysToDeliver = 3;
    let cityHub = 'Bengaluru Air Express Hub';

    if (['1', '2'].includes(firstDigit)) {
      cityHub = 'Delhi NCR Logistics Hub';
      daysToDeliver = 3;
    } else if (['3', '4'].includes(firstDigit)) {
      cityHub = 'Mumbai Western Hub';
      daysToDeliver = 2;
    } else if (['5', '6'].includes(firstDigit)) {
      cityHub = 'Bengaluru South Hub';
      daysToDeliver = 2;
    } else if (['7', '8'].includes(firstDigit)) {
      cityHub = 'Kolkata Eastern Hub';
      daysToDeliver = 4;
    }

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + daysToDeliver);

    const formattedDate = deliveryDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });

    return ApiResponse.success(res, 'Pincode serviceable', {
      pincode,
      isServiceable: true,
      estimatedDeliveryDate: formattedDate,
      daysToDeliver,
      hub: cityHub,
      codAvailable: true,
      freeShippingThreshold: 999
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getTravelKits,
  compareProducts,
  smartTravelFinder,
  checkDeliveryPincode
};

