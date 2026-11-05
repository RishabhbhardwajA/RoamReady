'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Check, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/api';

export const CartDrawer: React.FC = () => {
  const router = useRouter();
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, Math.round((cart.subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - cart.subtotal);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = codeToApply || couponCode;
    if (!code) return;
    setCouponLoading(true);
    setCouponError(null);
    setCouponMessage(null);
    try {
      const msg = await applyCoupon(code);
      setCouponMessage(msg);
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Your Travel Bag ({cart.items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-brand-50 px-4 sm:px-6 py-3 border-b border-brand-100 text-xs">
            {remainingForFree > 0 ? (
              <div className="space-y-1.5">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>Add <strong>{formatINR(remainingForFree)}</strong> more for <strong>FREE Air Express</strong></span>
                  <span className="font-bold text-brand-700">{progressPercent}%</span>
                </div>
                <div className="w-full bg-brand-200/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-brand-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>You unlocked FREE BlueDart Air Shipping!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">Your travel bag is empty</h3>
                <p className="text-xs text-slate-400 max-w-xs">
                  Discover TSA-approved combination locks, compression packing cubes, and heavy-duty travel gear.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push('/products');
                  }}
                  className="mt-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors shadow-sm"
                >
                  Explore Essentials
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={`${item.slug}-${item.variantId}`}
                  className="flex gap-3 sm:gap-4 p-3 bg-slate-50/70 border border-slate-100 rounded-2xl"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 hover:text-brand-600 transition-colors"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Color: <span className="font-medium text-slate-700">{item.colorName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {formatINR(item.price * item.quantity)}
                      </span>
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.slug, item.quantity - 1)}
                          className="p-1 px-2 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.slug, item.quantity + 1)}
                          className="p-1 px-2 text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon Code Section */}
          {cart.items.length > 0 && (
            <div className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              {cart.appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Coupon <strong>{cart.appliedCoupon.code}</strong> Applied</span>
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
                      placeholder="Enter promo code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 uppercase font-mono"
                    />
                    <button
                      onClick={() => handleApplyCoupon()}
                      disabled={couponLoading || !couponCode}
                      className="px-3.5 py-1.5 bg-obsidian-900 hover:bg-obsidian-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                  {couponMessage && <p className="text-[11px] text-emerald-600">{couponMessage}</p>}
                  {/* Quick Click Coupons */}
                  <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[10px]">
                    <span className="text-slate-400 flex items-center gap-1 font-medium">
                      <Tag className="w-3 h-3" /> Quick:
                    </span>
                    <button
                      onClick={() => handleApplyCoupon('WELCOME10')}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold px-2 py-0.5 rounded-md"
                    >
                      WELCOME10 (-10%)
                    </button>
                    <button
                      onClick={() => handleApplyCoupon('ROAMFREEDOM')}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono font-bold px-2 py-0.5 rounded-md"
                    >
                      ROAMFREEDOM (-₹200)
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Summary & Checkout */}
          {cart.items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatINR(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>- {formatINR(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Air Express Shipping</span>
                  <span className="font-semibold text-slate-900">
                    {cart.shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatINR(cart.shipping)}
                  </span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-brand-600">{formatINR(cart.total)}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    router.push('/checkout');
                  }}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between text-center text-xs">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="text-slate-500 hover:text-slate-800 underline mx-auto"
                  >
                    View detailed cart & shipping options
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
