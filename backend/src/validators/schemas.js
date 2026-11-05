const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid 10-digit phone number is required'),
  street: z.string().min(3, 'Street address is required'),
  apartment: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().regex(/^\d{6}$/, 'Valid 6-digit Indian PIN code required'),
  country: z.string().default('India'),
  isDefault: z.boolean().optional()
});

const createOrderSchema = z.object({
  customerDetails: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().min(10)
  }),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['upi', 'card', 'netbanking', 'cod']),
  couponCode: z.string().optional()
});

const addReviewSchema = z.object({
  productSlug: z.string().min(1),
  rating: z.number().min(1).max(5),
  title: z.string().min(3, 'Review title must be at least 3 characters'),
  comment: z.string().min(10, 'Review comment must be at least 10 characters'),
  travelType: z.string().optional()
});

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  addressSchema,
  createOrderSchema,
  addReviewSchema,
  validate
};

