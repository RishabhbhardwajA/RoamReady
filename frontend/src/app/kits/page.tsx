'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Layers, ShoppingBag, CheckCircle2, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { apiClient, formatINR } from '@/lib/api';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export default function TravelKitsPage() {
  const { addItem } = useCart();
  const [kits, setKits] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/products/kits')
      .then((res) => {
        if (res.data.success && res.data.data?.kits) {
          setKits(res.data.data.kits);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Ready-to-Fly Travel Kits</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Curated Bundles. Maximum Savings.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-3 max-w-xl mx-auto leading-relaxed">
            Stop buying random accessories individually. Our flight-ready bundles combine TSA security locks, heavy-duty straps, privacy tags, and compression cubes at up to 30% bundle discount.
          </p>
        </div>

        {/* Kits Grid */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading travel bundles...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {kits.map((kit) => (
              <div
                key={kit._id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md flex flex-col justify-between group hover:shadow-xl transition-all"
              >
                <div>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <img
                      src={kit.thumbnail}
                      alt={kit.title}
                      className="w-full sm:w-44 h-48 sm:h-44 object-cover rounded-2xl border border-slate-200 flex-shrink-0"
                    />
                    <div className="space-y-2">
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        {kit.badge || 'Bundle Deal'}
                      </span>
                      <h3 className="font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-brand-600 transition-colors">
                        {kit.title}
                      </h3>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-2xl font-extrabold text-slate-900">
                          {formatINR(kit.price)}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          {formatINR(kit.originalPrice)}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          Save {formatINR(kit.originalPrice - kit.price)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                    {kit.description}
                  </p>

                  {/* Highlights */}
                  <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                      What&apos;s inside this bundle:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>TSA Master-Key Approved Lock</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Privacy-Shield Aluminum Tag</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>High-Density Luggage Strap</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>Modular Compression Packing Set</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => addItem(kit, kit.variants[0], 1)}
                    className="w-full sm:flex-1 bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all active:scale-98"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Travel Kit to Bag</span>
                  </button>
                  <Link
                    href={`/products/${kit.slug}`}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-3.5 px-5 rounded-xl text-center flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Full Specs</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
