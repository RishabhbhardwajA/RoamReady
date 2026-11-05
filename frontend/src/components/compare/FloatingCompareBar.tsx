'use client';

import React from 'react';
import Link from 'next/link';
import { Scale, X, ArrowRight } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';

export const FloatingCompareBar: React.FC = () => {
  const { compareProducts, removeFromCompare, clearCompare } = useCompare();

  if (compareProducts.length === 0) return null;

  return (
    <aside aria-label="Product Comparison Bar" className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 z-40 max-w-lg bg-obsidian-950/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center gap-2 pl-2">
        <Scale className="w-4 h-4 text-amber-accent flex-shrink-0" />
        <span className="text-xs font-bold whitespace-nowrap">
          Compare ({compareProducts.length}/4)
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto py-1">
        {compareProducts.map((p) => (
          <div key={p.slug} className="relative group flex-shrink-0">
            <img
              src={p.thumbnail}
              alt={p.title}
              className="w-9 h-9 object-cover rounded-lg border border-slate-700"
            />
            <button
              onClick={() => removeFromCompare(p.slug)}
              className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={clearCompare}
          className="text-[10px] text-slate-400 hover:text-white underline whitespace-nowrap"
        >
          Clear
        </button>
        <Link
          href="/compare"
          className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm whitespace-nowrap"
        >
          <span>Compare</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
};
