'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShieldCheck,
  Truck,
  Heart,
  ShoppingBag,
  Zap,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Check,
  Scale,
  Sparkles,
  Info,
  Clock
} from 'lucide-react';
import { apiClient, formatINR } from '@/lib/api';
import { Product, ProductVariant, Review } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { ProductCard } from '@/components/product/ProductCard';

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCompare, isComparing, removeFromCompare } = useCompare();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Active states
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // PIN code checker state
  const [pincode, setPincode] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<any>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // Review submission state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerCity, setReviewerCity] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    fetchProductDetails();
  }, [params.slug]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(`/products/${params.slug}`);
      if (res.data.success) {
        const prod: Product = res.data.data.product;
        setProduct(prod);
        setSelectedImage(prod.images?.[0] || prod.thumbnail);
        setSelectedVariant(prod.variants?.[0] || null);
        setRelatedProducts(res.data.data.relatedProducts || []);
        setReviews(res.data.data.reviews || []);
      }
    } catch (e) {
      console.error('Error fetching product:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code');
      setPincodeResult(null);
      return;
    }

    setPincodeLoading(true);
    setPincodeError(null);
    try {
      const res = await apiClient.get(`/products/check-pincode/${pincode.trim()}`);
      if (res.data.success) {
        setPincodeResult(res.data.data);
      }
    } catch (err: any) {
      setPincodeError(err.response?.data?.message || 'PIN code not serviceable');
      setPincodeResult(null);
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    await addItem(product, selectedVariant || undefined, quantity);
  };

  const handleBuyNow = async () => {
    if (!product) return;
    await addItem(product, selectedVariant || undefined, quantity);
    router.push('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setReviewSubmitting(true);
    try {
      const res = await apiClient.post('/reviews', {
        productSlug: product.slug,
        rating: newRating,
        title: newTitle,
        comment: newComment,
        userName: reviewerName || 'Verified Traveler',
        userCity: reviewerCity || 'Mumbai',
        travelType: 'Frequent Flyer'
      });
      if (res.data.success) {
        setReviewSuccess(true);
        setReviews([res.data.data.review, ...reviews]);
        setTimeout(() => {
          setShowReviewModal(false);
          setReviewSuccess(false);
          setNewTitle('');
          setNewComment('');
        }, 1500);
      }
    } catch (err) {
      console.error('Review submit failed:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-500 border-t-transparent" />
        <p className="mt-2 text-xs">Loading travel gear specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
        <Link href="/products" className="text-brand-600 text-sm font-semibold underline mt-2 inline-block">
          Return to All Travel Gear
        </Link>
      </div>
    );
  }

  const isFavorited = isInWishlist(product.slug);
  const comparing = isComparing(product.slug);

  return (
    <div className="min-h-screen py-8 sm:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="text-xs text-slate-500 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/80 w-fit">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-600">Essentials</Link>
          <span>/</span>
          <Link href={`/products?category=${product.categorySlug}`} className="hover:text-brand-600">
            {product.categoryName}
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-900 truncate">{product.title}</span>
        </nav>

        {/* Top Product View: Gallery (Left) & Buy Box (Right) */}
        <div className="glass-panel rounded-4xl p-6 sm:p-10 border border-white/80 shadow-glass grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white/75 backdrop-blur-xl">
          {/* Left Column: Image Gallery & Zoom */}
          <div className="lg:col-span-7 space-y-4">
            <div
              className="relative aspect-square sm:aspect-[4/3] rounded-3xl overflow-hidden bg-slate-100/60 border border-white/80 cursor-zoom-in shadow-xs"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <img
                src={selectedImage}
                alt={product.title}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'hover:scale-105'
                }`}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                {product.badge && (
                  <span className="bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-amber-accent text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                    {product.badge}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="bg-rose-600/90 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                    {product.discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Wishlist Floating Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(product.slug);
                }}
                className={`absolute top-4 right-4 w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md border border-white/80 ${
                  isFavorited ? 'bg-rose-50 text-rose-500 scale-110 border-rose-200' : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            {/* Thumbnail selector */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImage === img
                        ? 'border-brand-600 scale-105 shadow-md'
                        : 'border-white/80 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing, Variants, PIN Checker, Buy Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-600">
                  {product.categoryName}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs font-mono text-slate-400">SKU: {selectedVariant?.sku || product.sku}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {product.title}
              </h1>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-800 border border-slate-200/60 shadow-xs">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{product.rating}</span>
                </div>
                <span className="text-xs text-slate-500 underline font-medium">
                  {product.reviewCount} Verified Customer Reviews
                </span>
              </div>
            </div>

            {/* Price Box (Curvy Glass Card) */}
            <div className="p-5 glass-card rounded-3xl bg-white/70 border border-white/80 shadow-xs backdrop-blur-md">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-slate-900">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent > 0 && (
                  <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200/50">
                    Save {formatINR(product.originalPrice - product.price)}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1 font-light">
                Inclusive of all taxes &bull; Free express delivery on orders over ₹999
              </span>
            </div>

            {/* Variant / Color Swatches */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900 flex justify-between">
                  <span>Selected Color: <strong>{selectedVariant?.colorName}</strong></span>
                  <span className="text-slate-400 font-normal">{product.variants.length} finishes</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        if (v.image) setSelectedImage(v.image);
                      }}
                      className={`group flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all ${
                        selectedVariant?.id === v.id
                          ? 'border-brand-600 bg-brand-50/80 ring-2 ring-brand-500 ring-offset-1'
                          : 'border-slate-200 hover:border-slate-300 bg-white/60'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: v.colorHex }}
                      />
                      <span className="text-xs font-medium text-slate-800">{v.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Info */}
            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 block">Quantity</span>
                <div className="flex items-center border border-slate-200/80 rounded-full bg-white/90 shadow-xs px-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 px-3 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-1 px-3 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 block">Availability</span>
                <div className="text-xs text-emerald-700 bg-emerald-50/90 backdrop-blur-md px-3.5 py-2 rounded-full font-bold flex items-center gap-1.5 border border-emerald-200/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ready for Dispatch</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons: Add to Cart & Buy Now */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-brand-600 hover:bg-brand-500 active:scale-98 text-white font-extrabold py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md text-sm sm:text-base border border-white/20"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Travel Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full bg-obsidian-950 hover:bg-black active:scale-98 text-white font-extrabold py-4 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md text-sm sm:text-base border border-white/20"
              >
                <Zap className="w-4 h-4 text-amber-accent" />
                <span>Express Buy Now</span>
              </button>

              <button
                onClick={() => {
                  if (comparing) removeFromCompare(product.slug);
                  else addToCompare(product);
                }}
                className={`w-full py-3 px-4 rounded-full border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  comparing
                    ? 'border-brand-500 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:bg-white/80'
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>{comparing ? 'Added to Comparison (Open Compare)' : 'Compare with other travel gear'}</span>
              </button>
            </div>

            {/* Indian PIN Code Delivery Checker (Curvy Glass Card) */}
            <div className="pt-4 border-t border-slate-200/50">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                <MapPin className="w-4 h-4 text-brand-600" />
                <span>Check Delivery Timeline & COD Availability</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit PIN code (e.g. 560038)"
                  value={pincode}
                  maxLength={6}
                  onChange={(e) => setPincode(e.target.value)}
                  className="flex-1 bg-white/80 rounded-full px-4 py-2.5 text-xs text-slate-900 focus:outline-none border border-slate-200/80 focus:border-brand-500 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={pincodeLoading || !pincode}
                  className="bg-slate-900 hover:bg-black disabled:opacity-50 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-xs"
                >
                  {pincodeLoading ? 'Checking...' : 'Check'}
                </button>
              </form>

              {pincodeError && <p className="text-[11px] text-red-500 mt-2">{pincodeError}</p>}
              {pincodeResult && (
                <div className="mt-3 p-3.5 glass-card rounded-2xl border border-emerald-200/70 text-xs text-emerald-900 space-y-1 bg-emerald-50/80 backdrop-blur-md">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Delivering by <strong>{pincodeResult.estimatedDeliveryDate}</strong></span>
                  </div>
                  <div className="text-[11px] text-emerald-700">
                    Dispatched from {pincodeResult.hub} &bull; BlueDart Air Express &bull; Cash on Delivery Available
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Specifications & Compatibility Matrix */}
        <div className="mt-12 glass-panel rounded-4xl p-6 sm:p-10 border border-white/80 shadow-glass space-y-8 bg-white/75 backdrop-blur-xl">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Technical Specifications & Engineering Details
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verified lab-tested specifications ensuring adherence to global civil aviation and luggage standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="p-3 text-slate-500 font-semibold w-1/3">Fabric / Alloy</th>
                    <td className="p-3 font-medium text-slate-900">{product.specifications.material}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="p-3 text-slate-500 font-semibold">Dimensions</th>
                    <td className="p-3 font-medium text-slate-900">{product.specifications.dimensions}</td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="p-3 text-slate-500 font-semibold">Item Weight</th>
                    <td className="p-3 font-medium text-slate-900">{product.specifications.weight}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="p-3 text-slate-500 font-semibold">Storage Capacity</th>
                    <td className="p-3 font-medium text-slate-900">{product.specifications.capacity || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="border border-slate-100 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <tbody>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="p-3 text-slate-500 font-semibold w-1/3">TSA Approved</th>
                    <td className="p-3 font-bold text-slate-900">
                      {product.specifications.tsaApproved ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Yes (Official TSA Master Compliant)
                        </span>
                      ) : (
                        'Standard Hardware'
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="p-3 text-slate-500 font-semibold">Water Resistance</th>
                    <td className="p-3 font-medium text-slate-900">{product.specifications.waterResistance}</td>
                  </tr>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="p-3 text-slate-500 font-semibold">Warranty</th>
                    <td className="p-3 font-medium text-slate-900">{product.specifications.warranty}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <th className="p-3 text-slate-500 font-semibold">Country of Origin</th>
                    <td className="p-3 font-medium text-slate-900">{product.specifications.originCountry}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Suitcase Compatibility Badges */}
          {product.luggageCompatibility && product.luggageCompatibility.length > 0 && (
            <div className="p-4 bg-brand-50/60 border border-brand-100 rounded-2xl space-y-2">
              <div className="text-xs font-bold text-brand-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Suitcase & Flight Compatibility Verified</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.luggageCompatibility.map((compat, i) => (
                  <span
                    key={i}
                    className="bg-white border border-brand-200 text-brand-800 text-xs px-3 py-1 rounded-full font-semibold shadow-2xs"
                  >
                    {compat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step-by-Step FAQs */}
        {product.faq && product.faq.length > 0 && (
          <div className="mt-12 glass-panel rounded-4xl p-6 sm:p-10 border border-white/80 shadow-glass space-y-6 bg-white/75 backdrop-blur-xl">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Product Guide & Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {product.faq.map((item, idx) => (
                <div
                  key={idx}
                  className="border border-white/80 rounded-3xl overflow-hidden transition-all bg-white/60 backdrop-blur-md shadow-xs"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900 hover:bg-white/80 transition-colors"
                  >
                    <span>{item.question}</span>
                    {activeFaq === idx ? (
                      <ChevronUp className="w-4 h-4 text-brand-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {activeFaq === idx && (
                    <div className="p-4 sm:p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white/40 font-light">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="mt-12 glass-panel rounded-4xl p-6 sm:p-10 border border-white/80 shadow-glass space-y-8 bg-white/75 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/50">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                Customer Reviews ({reviews.length})
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{product.rating} out of 5 stars</span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="bg-obsidian-950 hover:bg-black text-white text-xs font-bold px-6 py-3 rounded-full transition-all self-start sm:self-auto shadow-md border border-white/20 active:scale-95"
            >
              Write a Review
            </button>
          </div>

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-6 rounded-3xl glass-card bg-white/70 border border-white/80 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">{rev.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-light">{rev.comment}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 font-semibold text-slate-800">
                    <span>{rev.userName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span className="text-slate-400 font-normal">({rev.userCity})</span>
                  </div>
                  <span className="text-[10px] bg-white/80 px-2.5 py-0.5 rounded-full border border-slate-200 text-slate-600 shadow-2xs">
                    {rev.travelType || 'Verified Traveler'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Frequently Bought Together with this Item
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal (Curvy Glass Modal) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="glass-panel rounded-4xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-white/80 space-y-4 bg-white/95 backdrop-blur-2xl">
            <h3 className="font-extrabold text-lg text-slate-900">Review {product.title}</h3>
            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-bold text-center">
                Review submitted successfully! Thank you for helping other travelers.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="text-amber-500 p-1"
                      >
                        <Star className={`w-6 h-6 ${star <= newRating ? 'fill-amber-500' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Verma"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full bg-slate-100/80 rounded-2xl px-4 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mumbai, Bengaluru"
                    value={reviewerCity}
                    onChange={(e) => setReviewerCity(e.target.value)}
                    className="w-full bg-slate-100/80 rounded-2xl px-4 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flawless flight to London, highly durable!"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-slate-100/80 rounded-2xl px-4 py-2 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Feedback</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share how the accessories performed during baggage handling or transit..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full bg-slate-100/80 rounded-2xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="w-1/2 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="w-1/2 bg-brand-600 text-white py-3 rounded-full text-xs font-bold hover:bg-brand-500 transition-colors shadow-sm"
                  >
                    {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

