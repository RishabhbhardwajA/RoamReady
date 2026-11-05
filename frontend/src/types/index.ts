export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  colorName: string;
  colorHex: string;
  size: string;
  image: string;
  stockCount: number;
  inStock: boolean;
  additionalPrice?: number;
}

export interface ProductSpecifications {
  material: string;
  dimensions: string;
  weight: string;
  capacity?: string;
  lockType?: string;
  combinationDigits?: number;
  tsaApproved?: boolean;
  waterResistance?: string;
  compressionMechanism?: string;
  warranty: string;
  originCountry: string;
  closureType?: string;
}

export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  categorySlug: string;
  categoryName: string;
  brand: string;
  thumbnail: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
  isBestseller?: boolean;
  isNewArrival?: boolean;
  badge?: string;
  tags?: string[];
  variants: ProductVariant[];
  specifications: ProductSpecifications;
  luggageCompatibility?: string[];
  faq?: ProductFAQ[];
  isTravelKit?: boolean;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  image: string;
  icon?: string;
  badge?: string;
  displayOrder: number;
  productCount?: number;
}

export interface CartItem {
  product: string;
  productIdString?: string;
  slug: string;
  title: string;
  sku: string;
  variantId: string;
  price: number;
  image: string;
  colorName: string;
  size: string;
  quantity: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount?: number;
  minimumSpend: number;
  maxDiscount?: number;
}

export interface Cart {
  items: CartItem[];
  appliedCoupon: Coupon | null;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses?: Address[];
  avatar?: string;
}

export interface OrderItem {
  variantId: string;
  title: string;
  slug: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
  colorName: string;
  size: string;
}

export interface TrackingTimeline {
  status: string;
  timestamp: string;
  note: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    total: number;
  };
  couponApplied?: {
    code: string;
    discountAmount: number;
  };
  payment: {
    method: 'upi' | 'card' | 'netbanking' | 'cod';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    isDemoMode: boolean;
  };
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  tracking: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    timeline: TrackingTimeline[];
  };
  createdAt: string;
}

export interface Review {
  _id: string;
  productSlug: string;
  userName: string;
  userCity: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulVotes: number;
  travelType?: string;
  createdAt: string;
}

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  pendingOrders: number;
  completedOrders: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
}

