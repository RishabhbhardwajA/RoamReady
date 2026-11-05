'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

interface BestsellersSectionProps {
  products: Product[];
}

export const BestsellersSection: React.FC<BestsellersSectionProps> = ({ products }) => {
  const [filter, setFilter] = useState<'all' | 'locks' | 'cubes' | 'duffels'>('all');

  const filteredProducts = products.filter((p) => {
    if (filter === 'locks') return p.categorySlug === 'tsa-locks';
    if (filter === 'cubes') return p.categorySlug === 'packing-cubes';
    if (filter === 'duffels') return p.categorySlug === 'foldable-duffels';
    return true;
  });

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-amber-warm font-extrabold text-xs uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Bestselling Travel Gear
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 mt-4 md:mt-0 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'all'
                  ? 'bg-obsidian-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Favorites
            </button>
            <button
              onClick={() => setFilter('locks')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'locks'
                  ? 'bg-obsidian-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              TSA Locks
            </button>
            <button
              onClick={() => setFilter('cubes')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'cubes'
                  ? 'bg-obsidian-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Compression Cubes
            </button>
            <button
              onClick={() => setFilter('duffels')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                filter === 'duffels'
                  ? 'bg-obsidian-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Packable Duffels
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold px-8 py-3.5 rounded-full transition-colors"
          >
            <span>Explore All 25+ Travel Gear Essentials</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
