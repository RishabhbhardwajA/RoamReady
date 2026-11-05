const ApiResponse = require('../utils/apiResponse');
const dataStore = require('../services/dataStore');

const getCategories = async (req, res, next) => {
  try {
    const categories = await dataStore.findCategories();
    return ApiResponse.success(res, 'Categories fetched successfully', { categories });
  } catch (error) {
    next(error);
  }
};

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await dataStore.findCategoryBySlug(slug);

    if (!category) {
      return ApiResponse.error(res, 'Category not found', 404);
    }

    const productsResult = await dataStore.findProducts({ category: slug, limit: 20 });

    return ApiResponse.success(res, 'Category details fetched', {
      category,
      products: productsResult.products,
      totalProducts: productsResult.total
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug
};

