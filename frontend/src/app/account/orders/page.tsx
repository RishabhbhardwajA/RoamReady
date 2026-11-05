'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Package,
  Search,
  ExternalLink,
  X
} from 'lucide-react';
import { apiClient, formatINR } from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Manual Tracking search
  const [trackOrderNumber, setTrackOrderNumber] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [trackLoading, setTrackLoading] = useState(false);

  // Selected Order for Tracking Modal
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      apiClient.get('/orders/my-orders')
        .then((res) => {
          if (res.data.success && res.data.data?.orders) {
            setOrders(res.data.data.orders);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleManualTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderNumber.trim()) return;
    setTrackLoading(true);
    setTrackError(null);
    try {
      const res = await apiClient.post('/orders/track', { orderNumber: trackOrderNumber.trim() });
      if (res.data.success) {
        setTrackResult(res.data.data);
      }
    } catch (err: any) {
      setTrackError(err.response?.data?.message || 'Order not found');
      setTrackResult(null);
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Logistics & Orders
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Order History & BlueDart Express Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status updates, airway bill tracking numbers, and delivery timelines.
          </p>
        </div>

        {/* Public / Quick Tracking Bar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-brand-600" />
            <span>Track Any Order by Reference Number</span>
          </h3>
          <form onSubmit={handleManualTrack} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. RR-2026-123456"
              value={trackOrderNumber}
              onChange={(e) => setTrackOrderNumber(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-900 uppercase font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={trackLoading || !trackOrderNumber}
              className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
            >
              {trackLoading ? 'Locating...' : 'Track'}
            </button>
          </form>

          {trackError && <p className="text-xs text-red-500">{trackError}</p>}
          {trackResult && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Order: {trackResult.orderNumber}</span>
                <span className="text-brand-600 uppercase">{trackResult.orderStatus}</span>
              </div>
              <div className="text-slate-600">
                Carrier: <strong>{trackResult.tracking?.carrier}</strong> &bull; Tracking ID: <span className="font-mono font-bold text-slate-900">{trackResult.tracking?.trackingNumber}</span>
              </div>
              <div className="text-emerald-700 font-semibold">
                Estimated Delivery: {new Date(trackResult.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
            </div>
          )}
        </div>

        {/* User Orders List */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading order history...</div>
        ) : orders.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No orders yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven&apos;t placed any orders with this account yet. Ready to start your next trip?
            </p>
            <Link
              href="/products"
              className="inline-block bg-brand-600 text-white text-xs font-bold px-6 py-2.5 rounded-full"
            >
              Shop Essentials
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-slate-50/80 p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="text-slate-400">Order Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">{order.orderNumber}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.orderStatus === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.orderStatus === 'shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.orderStatus}
                    </span>

                    <button
                      onClick={() => setSelectedOrderForTracking(order)}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Truck className="w-3.5 h-3.5 text-brand-600" />
                      <span>Track Shipment</span>
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="p-4 sm:p-6 space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img src={item.image} alt={item.title} className="w-14 h-14 object-cover rounded-xl border border-slate-100 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.slug}`} className="font-bold text-xs sm:text-sm text-slate-900 hover:text-brand-600 transition-colors truncate block">
                          {item.title}
                        </Link>
                        <div className="text-[11px] text-slate-400">Color: {item.colorName} &bull; Qty: {item.quantity}</div>
                      </div>
                      <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                        {formatINR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Details */}
                <div className="bg-slate-50/40 p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
                  <div>
                    Delivering to: <strong className="text-slate-800">{order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.postalCode})</strong>
                  </div>
                  <div>
                    Total Paid: <strong className="text-brand-600 text-sm">{formatINR(order.pricing.total)}</strong> ({order.payment.method.toUpperCase()})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tracking Timeline Modal */}
      {selectedOrderForTracking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Live Air Waybill Tracking</span>
                <h3 className="font-extrabold text-slate-900 text-base">{selectedOrderForTracking.orderNumber}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
              <div>Carrier: <strong>{selectedOrderForTracking.tracking.carrier}</strong></div>
              <div>Air Waybill / Tracking No.: <strong className="font-mono text-brand-600">{selectedOrderForTracking.tracking.trackingNumber}</strong></div>
              <div>Estimated Delivery: <strong>{new Date(selectedOrderForTracking.tracking.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</strong></div>
            </div>

            {/* Timeline */}
            <div className="space-y-4 relative pl-6 border-l-2 border-brand-200 ml-3">
              {(selectedOrderForTracking.tracking.timeline || []).map((tl, i) => (
                <div key={i} className="relative space-y-0.5">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-brand-600 border-2 border-white shadow-xs" />
                  <div className="font-bold text-xs text-slate-900">{tl.status}</div>
                  <div className="text-[11px] text-slate-500">{tl.note}</div>
                  <div className="text-[10px] text-slate-400">{new Date(tl.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrderForTracking(null)}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl text-xs hover:bg-slate-800 transition-colors"
              >
                Close Tracking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

