'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { apiClient, formatINR } from '@/lib/api';
import { Order } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();

  // Multi-step form step (1: Details & Address, 2: Payment, 3: Confirmation)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [name, setName] = useState(user?.name || 'Rohan Sharma');
  const [email, setEmail] = useState(user?.email || 'traveler@roamready.com');
  const [phone, setPhone] = useState(user?.phone || '9123456789');
  const [street, setStreet] = useState('Hill Road, Bandra West');
  const [apartment, setApartment] = useState('Flat 12B, Sea Crest');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [postalCode, setPostalCode] = useState('400050');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('rohan@oksbi');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');

  // States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !street || !city || !state || !postalCode) {
      setError('Please fill in all required shipping address fields.');
      return;
    }
    if (!/^\d{6}$/.test(postalCode.trim())) {
      setError('Please enter a valid 6-digit Indian postal PIN code.');
      return;
    }
    setError(null);
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        customerDetails: {
          name,
          email,
          phone
        },
        shippingAddress: {
          fullName: name,
          phone,
          street,
          apartment,
          city,
          state,
          postalCode,
          country: 'India'
        },
        paymentMethod,
        couponCode: cart.appliedCoupon?.code
      };

      const res = await apiClient.post('/orders', orderPayload);
      if (res.data.success) {
        setConfirmedOrder(res.data.data.order);
        setStep(3);
        await clearCart();
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0 && step !== 3) {
    return (
      <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Your bag is empty</h2>
          <p className="text-xs text-slate-500">Please add travel accessories before proceeding to checkout.</p>
          <Link href="/products" className="bg-brand-600 text-white text-xs font-bold px-6 py-2.5 rounded-full inline-block">
            Shop Travel Gear
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-slate-200/80 text-slate-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5 text-brand-600" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {step === 3 ? 'Order Confirmed!' : 'Express Secure Checkout'}
          </h1>

          {/* Stepper Steps */}
          {step !== 3 && (
            <div className="flex items-center justify-center gap-4 mt-6 text-xs">
              <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-brand-600 font-extrabold' : 'text-emerald-600 font-semibold'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 1 ? 'bg-brand-600 text-white' : 'bg-emerald-600 text-white'}`}>1</span>
                <span>Shipping Address</span>
              </div>
              <span className="text-slate-300">———</span>
              <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-brand-600 font-extrabold' : 'text-slate-400'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 2 ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
                <span>Payment & Review</span>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 max-w-2xl mx-auto">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Shipping Address Form */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 pb-3 border-b border-slate-100">
                1. Customer & Delivery Address
              </h2>

              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (10 digits) *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address for Tracking *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Road, Landmark"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Apartment, Suite (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Building C, Floor 4"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">PIN Code (6 Digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full bg-slate-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm transition-colors shadow-sm"
                  >
                    <span>Continue to Payment Selection</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 self-start">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Order Review ({cart.items.length} items)
              </h3>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={`${item.slug}-${item.variantId}`} className="flex gap-3 text-xs">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg border border-slate-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400">Qty: {item.quantity} &bull; {item.colorName}</div>
                      <div className="font-bold text-slate-900">{formatINR(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatINR(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>- {formatINR(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Air Express Shipping</span>
                  <span>{cart.shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatINR(cart.shipping)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-brand-600">{formatINR(cart.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Selection */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
                  2. Choose Payment Method
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-brand-600 hover:underline font-bold"
                >
                  Edit Address
                </button>
              </div>

              {/* Explicit Demo Mode Indicator */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Demo Mode Enabled:</strong> Test payments are simulated safely without deducting real bank funds.
                </span>
              </div>

              {/* Payment Methods Tabs */}
              <div className="space-y-3">
                {/* UPI Option */}
                <label className={`block p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <div className="font-bold text-xs sm:text-sm text-slate-900">UPI (Google Pay, PhonePe, Paytm, BHIM)</div>
                    </div>
                    <QrCode className="w-5 h-5 text-slate-500" />
                  </div>
                  {paymentMethod === 'upi' && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2">
                      <label className="text-[11px] font-bold text-slate-700 block">Enter your Virtual Payment Address (VPA)</label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                      />
                    </div>
                  )}
                </label>

                {/* Card Option */}
                <label className={`block p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <div className="font-bold text-xs sm:text-sm text-slate-900">Credit / Debit Card (Visa, Mastercard, RuPay)</div>
                    </div>
                    <CreditCard className="w-5 h-5 text-slate-500" />
                  </div>
                  {paymentMethod === 'card' && (
                    <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Card Number (Demo prefilled)</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Net Banking Option */}
                <label className={`block p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'netbanking' ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'netbanking'}
                      onChange={() => setPaymentMethod('netbanking')}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <div className="font-bold text-xs sm:text-sm text-slate-900">Net Banking (All Indian Banks Supported)</div>
                  </div>
                </label>

                {/* COD Option */}
                <label className={`block p-4 rounded-2xl border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500' : 'border-slate-200 hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-brand-600 focus:ring-brand-500"
                      />
                      <div className="font-bold text-xs sm:text-sm text-slate-900">Cash on Delivery (COD)</div>
                    </div>
                    <Truck className="w-5 h-5 text-slate-500" />
                  </div>
                </label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-2/3 bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-md transition-all active:scale-98"
                >
                  {loading ? (
                    <span>Securing Order...</span>
                  ) : (
                    <>
                      <span>Pay & Confirm {formatINR(cart.total)}</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 self-start">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Shipping Details
              </h3>
              <div className="text-xs text-slate-600 space-y-1">
                <div className="font-bold text-slate-900">{name} ({phone})</div>
                <div>{street}, {apartment}</div>
                <div>{city}, {state} - <strong>{postalCode}</strong></div>
                <div className="text-emerald-700 font-semibold pt-1">Carrier: BlueDart Air Express</div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatINR(cart.subtotal)}</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>- {formatINR(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{cart.shipping === 0 ? <strong className="text-emerald-600">FREE</strong> : formatINR(cart.shipping)}</span>
                </div>
                <div className="border-t border-slate-100 pt-2 flex justify-between text-base font-extrabold text-slate-900">
                  <span>Final Payable</span>
                  <span className="text-brand-600">{formatINR(cart.total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmation */}
        {step === 3 && confirmedOrder && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in-95 duration-400">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Order Confirmed & Payment Verified
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Thank You for Choosing RoamReady!
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Your travel gear is being prepared at our Bengaluru Hub. Confirmation has been dispatched to <strong>{confirmedOrder.customerDetails.email}</strong>.
              </p>
            </div>

            {/* Reference Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Order Reference:</span>
                <span className="font-mono font-bold text-slate-900">{confirmedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">BlueDart Tracking ID:</span>
                <span className="font-mono font-bold text-brand-600">{confirmedOrder.tracking.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated Delivery:</span>
                <span className="font-bold text-slate-900">
                  {new Date(confirmedOrder.tracking.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-extrabold text-slate-900">{formatINR(confirmedOrder.pricing.total)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/account/orders"
                className="w-full sm:w-1/2 bg-obsidian-950 hover:bg-black text-white text-xs font-bold py-3.5 rounded-xl transition-colors"
              >
                Track Live Order Timeline
              </Link>
              <Link
                href="/products"
                className="w-full sm:w-1/2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-3.5 rounded-xl transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
