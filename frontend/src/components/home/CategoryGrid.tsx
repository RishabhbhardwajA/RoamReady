'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Lock, Package, Briefcase, ShieldCheck, Tag, Layers } from 'lucide-react';
import { Category } from '@/types';

interface CategoryGridProps {
  categories: Category[];
}

const iconMap: Record<string, any> = {
  Lock,
  Package,
  Briefcase,
  ShieldCheck,
  Tag,
  Layers
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-brand-600 font-extrabold text-xs uppercase tracking-widest">
              Engineered Categories
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mt-1">
              Shop by Travel Essential
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View All Categories</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon || 'Package'] || Package;
            return (
              <Link
                key={cat.slug}
                href={cat.slug === 'travel-kits' ? '/kits' : `/products?category=${cat.slug}`}
                className="group relative bg-white border border-slate-200/80 rounded-3xl p-6 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between h-72"
              >
                {/* Background image preview with smooth gradient overlay */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-20 group-hover:opacity-30"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                </div>

                {/* Top Badge & Icon */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-brand-600 group-hover:text-white text-slate-800 flex items-center justify-center transition-colors shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  {cat.badge && (
                    <span className="bg-obsidian-900 text-amber-accent text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                      {cat.badge}
                    </span>
                  )}
                </div>

                {/* Bottom Title & Description */}
                <div className="relative z-10">
                  <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-brand-600 transition-colors flex items-center justify-between">
                    <span>{cat.name}</span>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {cat.shortDescription || cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
