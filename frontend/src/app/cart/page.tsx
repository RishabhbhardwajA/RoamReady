'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Check,
  Tag,
  Truck,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/api';

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - cart.subtotal);

  const handleApplyCoupon = async (codeToUse?: string) => {
    const code = codeToUse || couponCode;
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);
    try {
      await applyCoupon(code);
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.message || 'Coupon not valid');
    } finally {
      setCouponLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center relative">
        <div className="max-w-md w-full mx-auto p-8 glass-panel rounded-4xl border border-white/80 shadow-glass text-center space-y-4 bg-white/75 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mx-auto text-brand-600 shadow-xs">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Your Travel Bag is Empty</h2>
          <p className="text-xs text-slate-500 font-light">
            Looks like you haven&apos;t added any luggage locks, compression cubes, or travel essentials yet.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-7 py-3.5 rounded-full transition-all shadow-md active:scale-95 border border-white/20"
            >
              <span>Explore Travel Essentials</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 sm:py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/50 mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
              Review Selected Items
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 mt-0.5">
              Your Travel Shopping Bag ({cart.items.reduce((s, i) => s + i.quantity, 0)})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-slate-400 hover:text-rose-600 transition-colors self-start sm:self-auto bg-white/60 px-3 py-1 rounded-full border border-slate-200/60"
          >
            Clear All Items
          </button>
        </div>

        {/* Free Shipping Alert (Curvy Glass Panel) */}
        <div className="glass-panel p-4 sm:p-5 rounded-3xl border border-white/80 shadow-glass mb-8 text-xs bg-white/75 backdrop-blur-xl">
          {remainingForFree > 0 ? (
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium text-slate-700">
                <span>Add <strong>{formatINR(remainingForFree)}</strong> more to qualify for <strong>FREE Air Express Shipping</strong></span>
                <span className="font-bold text-brand-700">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-brand-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Great news! You have unlocked FREE PAN-India BlueDart Air Shipping!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Items Column */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => (
              <div
                key={`${item.slug}-${item.variantId}`}
                className="glass-card p-5 sm:p-6 rounded-4xl border border-white/80 shadow-glass flex flex-col sm:flex-row gap-5 items-center justify-between bg-white/75 backdrop-blur-xl"
              >
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-2xl border border-slate-100 flex-shrink-0"
                  />
                  <div className="space-y-1">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <div className="text-xs text-slate-500">
                      Color: <strong className="text-slate-700">{item.colorName}</strong> &bull; Size: {item.size}
                    </div>
                    <div className="text-xs font-bold text-slate-900 sm:hidden">
                      {formatINR(item.price)} each
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs text-slate-400">Unit Price</div>
                    <div className="font-bold text-xs text-slate-700">{formatINR(item.price)}</div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.variantId, item.slug, item.quantity - 1)}
                      className="p-1.5 px-3 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.variantId, item.slug, item.quantity + 1)}
                      className="p-1.5 px-3 text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <div className="text-xs text-slate-400 sm:hidden">Total</div>
                    <div className="font-extrabold text-sm sm:text-base text-slate-900">
                      {formatINR(item.price * item.quantity)}
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.variantId)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Coupon Card (Curvy Glass Panel) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-4xl border border-white/80 shadow-glass space-y-6 bg-white/75 backdrop-blur-xl">
              <h3 className="font-extrabold text-base text-slate-900 pb-3 border-b border-slate-200/50">
                Order Summary
              </h3>

              {/* Coupon Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Discount Code
                </label>
                {cart.appliedCoupon ? (
                  <div className="p-3 bg-emerald-50/90 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs text-emerald-800 backdrop-blur-md">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{cart.appliedCoupon.code}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. WELCOME10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 bg-white/80 border border-slate-200/80 rounded-full px-4 py-2 text-xs uppercase font-mono text-slate-900 focus:outline-none focus:border-brand-500 shadow-inner"
                      />
                      <button
                        onClick={() => handleApplyCoupon()}
                        disabled={couponLoading || !couponCode}
                        className="bg-obsidian-950 hover:bg-black text-white text-xs font-bold px-5 py-2 rounded-full disabled:opacity-50 transition-all shadow-xs"
                      >
                        {couponLoading ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                    <div className="flex items-center gap-1 text-[10px] text-slate-400">
                      <Tag className="w-3 h-3" />
                      <span>Available: <strong>WELCOME10</strong> (10% off), <strong>ROAMFREEDOM</strong> (₹200 off)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-200/50 pt-4 font-light">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatINR(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>- {formatINR(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Air Express Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {cart.shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatINR(cart.shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (18% included)</span>
                  <span className="font-semibold text-slate-500">₹{Math.round(cart.total * 0.18 / 1.18)}</span>
                </div>
                <div className="border-t border-slate-200/50 pt-3 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-brand-600">{formatINR(cart.total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-4 px-6 rounded-full flex items-center justify-center gap-2 text-sm shadow-md transition-all active:scale-98 border border-white/20"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>256-Bit Encrypted Payment Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

