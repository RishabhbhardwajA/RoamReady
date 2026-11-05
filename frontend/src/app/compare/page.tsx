'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Scale, X, ShoppingBag, Plus, Check, Star, ArrowRight } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { useCart } from '@/context/CartContext';
import { apiClient, formatINR } from '@/lib/api';
import { Product } from '@/types';

export default function ComparePage() {
  const { compareProducts, removeFromCompare, addToCompare, clearCompare } = useCompare();
  const { addItem } = useCart();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  useEffect(() => {
    apiClient.get('/products?limit=20')
      .then((res) => {
        if (res.data.success && res.data.data) {
          setAllProducts(res.data.data);
        }
      })
      .catch(() => {});
  }, []);

  const attributes = [
    { key: 'categoryName', label: 'Category' },
    { key: 'price', label: 'Selling Price', format: 'currency' },
    { key: 'originalPrice', label: 'Original MRP', format: 'currency' },
    { key: 'rating', label: 'Customer Rating', format: 'rating' },
    { key: 'material', label: 'Fabric / Material', path: 'specifications.material' },
    { key: 'dimensions', label: 'Dimensions', path: 'specifications.dimensions' },
    { key: 'weight', label: 'Weight', path: 'specifications.weight' },
    { key: 'capacity', label: 'Capacity', path: 'specifications.capacity' },
    { key: 'tsaApproved', label: 'TSA Master Certified', path: 'specifications.tsaApproved', format: 'boolean' },
    { key: 'waterResistance', label: 'Water Repellency', path: 'specifications.waterResistance' },
    { key: 'warranty', label: 'Warranty Coverage', path: 'specifications.warranty' }
  ];

  const getAttributeValue = (product: Product, attr: any) => {
    let val: any;
    if (attr.path) {
      const parts = attr.path.split('.');
      val = parts.reduce((o: any, p: string) => (o ? o[p] : undefined), product);
    } else {
      val = (product as any)[attr.key];
    }

    if (attr.format === 'currency') {
      return formatINR(Number(val) || 0);
    }
    if (attr.format === 'rating') {
      return (
        <span className="flex items-center gap-1 font-bold text-slate-800">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{val || '4.8'}</span>
        </span>
      );
    }
    if (attr.format === 'boolean') {
      return val ? (
        <span className="text-emerald-600 font-bold flex items-center gap-1">
          <Check className="w-4 h-4" /> Yes
        </span>
      ) : (
        <span className="text-slate-400">No</span>
      );
    }

    return val || '—';
  };

  const availableToAdd = allProducts.filter(
    (p) => !compareProducts.some((cp) => cp.slug === p.slug)
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-brand-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4" />
              <span>Specification Comparison</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Compare Travel Gear Side-by-Side
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Analyze specs, weight, dimensions, TSA certifications, and materials across our product lineup.
            </p>
          </div>

          {compareProducts.length > 0 && (
            <button
              onClick={clearCompare}
              className="mt-4 sm:mt-0 text-xs text-red-600 hover:underline font-bold"
            >
              Clear Comparison
            </button>
          )}
        </div>

        {compareProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg">No items selected for comparison</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select &quot;Compare&quot; on any product card or choose a travel accessory below to begin.
            </p>
            <div className="flex justify-center gap-3">
              <Link
                href="/products"
                className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors"
              >
                Browse All Gear
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Action Bar: Add another item */}
            {compareProducts.length < 4 && availableToAdd.length > 0 && (
              <div className="relative inline-block">
                <button
                  onClick={() => setShowAddDropdown(!showAddDropdown)}
                  className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-brand-600" />
                  <span>Add another gear to compare ({4 - compareProducts.length} spots left)</span>
                </button>

                {showAddDropdown && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 max-h-60 overflow-y-auto">
                    {availableToAdd.map((p) => (
                      <button
                        key={p.slug}
                        onClick={() => {
                          addToCompare(p);
                          setShowAddDropdown(false);
                        }}
                        className="w-full text-left p-2 hover:bg-slate-50 rounded-xl text-xs flex items-center gap-2 transition-colors"
                      >
                        <img src={p.thumbnail} alt={p.title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{p.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comparison Table */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60">
                    <th className="p-4 sm:p-6 w-48 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                      Product
                    </th>
                    {compareProducts.map((p) => (
                      <th key={p.slug} className="p-4 sm:p-6 w-64 align-top">
                        <div className="relative space-y-3">
                          <button
                            onClick={() => removeFromCompare(p.slug)}
                            className="absolute -top-2 -right-2 text-slate-400 hover:text-red-500 p-1"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-24 h-24 object-cover rounded-2xl border border-slate-200"
                          />
                          <div>
                            <Link
                              href={`/products/${p.slug}`}
                              className="font-bold text-xs sm:text-sm text-slate-900 hover:text-brand-600 line-clamp-2"
                            >
                              {p.title}
                            </Link>
                            <div className="font-extrabold text-base text-slate-900 mt-1">
                              {formatINR(p.price)}
                            </div>
                          </div>
                          <button
                            onClick={() => addItem(p, p.variants[0], 1)}
                            className="w-full bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {attributes.map((attr, idx) => (
                    <tr
                      key={attr.key}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}
                    >
                      <th className="p-4 sm:p-5 font-bold text-slate-700 w-48 bg-slate-50/80">
                        {attr.label}
                      </th>
                      {compareProducts.map((p) => (
                        <td key={p.slug} className="p-4 sm:p-5 text-slate-800">
                          {getAttributeValue(p, attr)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
