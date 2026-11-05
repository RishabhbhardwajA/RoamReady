'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { apiClient } from '@/lib/api';
import { Product } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

export default function WishlistPage() {
  const { wishlistSlugs } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistSlugs.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    apiClient.get('/products?limit=50')
      .then((res) => {
        if (res.data.success && res.data.data) {
          const filtered = res.data.data.filter((p: Product) => wishlistSlugs.includes(p.slug));
          setProducts(filtered);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [wishlistSlugs]);

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            Saved Travel Gear
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">
            Your Wishlist ({wishlistSlugs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Items you have bookmarked for your upcoming journeys and vacations.
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading your saved gear...</div>
        ) : products.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200/80 text-center space-y-4 max-w-md mx-auto shadow-xs">
            <Heart className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-lg">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500">
              Tap the heart icon on any TSA lock, compression set, or travel duffel to save it for later.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-6 py-2.5 rounded-full inline-flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Browse Travel Essentials</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

