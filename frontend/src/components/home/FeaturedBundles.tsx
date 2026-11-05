'use client';

import React from 'react';
import Link from 'next/link';
import { Layers, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/api';

interface FeaturedBundlesProps {
  bundles: Product[];
}

export const FeaturedBundles: React.FC<FeaturedBundlesProps> = ({ bundles }) => {
  const { addItem } = useCart();

  return (
    <section className="relative mx-3 sm:mx-6 my-8 rounded-4xl sm:rounded-5xl overflow-hidden bg-gradient-to-br from-slate-900 via-obsidian-950 to-slate-900 py-16 md:py-24 text-white border border-white/10 shadow-2xl">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/20 text-amber-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Ready-to-Fly Travel Kits</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Curated Bundles. Maximum Savings.
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-light">
            Save up to 30% compared to purchasing individual accessories. Pre-packaged for effortless airport and holiday readiness.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {bundles.map((bundle) => (
            <div
              key={bundle._id}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-4xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-amber-accent/50 transition-all duration-300"
            >
              {/* Highlight ribbon */}
              <div className="absolute top-6 right-6 bg-amber-accent text-obsidian-950 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Save {formatINR(bundle.originalPrice - bundle.price)}
              </div>

              <div>
                <div className="flex gap-4 sm:gap-6 items-center">
                  <img
                    src={bundle.thumbnail}
                    alt={bundle.title}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-3xl border border-white/20 flex-shrink-0 shadow-md"
                  />
                  <div>
                    <span className="text-xs font-bold text-amber-accent uppercase tracking-wider">
                      {bundle.badge || 'Complete Travel Bundle'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white mt-1 leading-snug">
                      {bundle.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-2xl font-extrabold text-white">
                        {formatINR(bundle.price)}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        {formatINR(bundle.originalPrice)}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-4 leading-relaxed font-light">
                  {bundle.description}
                </p>

                {/* Bundle Highlights List */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Included in this kit:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>TSA Master-Key Approved Lock</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Privacy Shield Aluminum Luggage Tag</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>Reinforced Compression Cubes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>3-Year Replacement Guarantee</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => addItem(bundle, bundle.variants[0], 1)}
                  className="w-full sm:flex-1 bg-amber-accent hover:bg-amber-400 text-obsidian-950 font-extrabold py-3.5 px-6 rounded-full flex items-center justify-center gap-2 transition-all shadow-md text-sm active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Kit to Travel Bag</span>
                </button>
                <Link
                  href={`/products/${bundle.slug}`}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold py-3.5 px-6 rounded-full text-center text-xs transition-colors flex items-center justify-center gap-1"
                >
                  <span>Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/kits"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-accent hover:text-white transition-colors bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20"
          >
            <span>Browse all specialized packing & flight bundles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

