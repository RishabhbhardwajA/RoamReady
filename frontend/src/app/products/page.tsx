'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Star,
  RefreshCw,
  ChevronDown
} from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Product, Category } from '@/types';
import { ProductCard } from '@/components/product/ProductCard';

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialSort = searchParams.get('sort') || 'popularity';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortOption, setSortOption] = useState<string>(initialSort);
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync with URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Load Categories once
  useEffect(() => {
    apiClient.get('/categories')
      .then((res) => {
        if (res.data.success && res.data.data?.categories) {
          setCategories(res.data.data.categories);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch Products based on active filters
  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery, sortOption, minPrice, maxPrice, ratingFilter, inStockOnly]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        limit: 24,
        sort: sortOption
      };
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (ratingFilter) params.rating = ratingFilter;
      if (inStockOnly) params.inStock = true;

      const res = await apiClient.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.data);
        setTotal(res.data.pagination?.total || res.data.data.length);
      }
    } catch (e) {
      console.error('Error fetching products:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortOption('popularity');
    setMinPrice('');
    setMaxPrice('');
    setRatingFilter('');
    setInStockOnly(false);
    router.push('/products');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-8">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest">
            RoamReady Catalog
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">
            Travel Essentials & Luggage Accessories
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Airport security-compliant TSA locks, double-zipper compression packing cubes, privacy luggage tags, heavy-duty baggage belts, and packable duffels.
          </p>
        </div>

        {/* Action Header: Search & Mobile Filter Toggle & Sort */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Sort By:</span>
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-slate-100 border-none rounded-xl px-3 py-2 pr-8 text-xs font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
                >
                  <option value="popularity">Popularity & Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating (Highest)</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid: Sidebar Filters + Products */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-extrabold text-sm text-slate-900">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                  <span>Filters</span>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-brand-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              {/* Categories Filter */}
              <div>
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">
                  Category
                </h4>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-brand-50 text-brand-700 font-bold'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Travel Categories ({categories.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug
                          ? 'bg-brand-50 text-brand-700 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">
                  Price Range (INR)
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-1/2 bg-slate-100 text-xs px-3 py-2 rounded-xl focus:outline-none"
                  />
                  <span className="text-slate-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-1/2 bg-slate-100 text-xs px-3 py-2 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">
                  Minimum Rating
                </h4>
                <div className="space-y-1.5 text-xs">
                  {['4.8', '4.5', '4.0'].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setRatingFilter(ratingFilter === rate ? '' : rate)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
                        ratingFilter === rate
                          ? 'bg-amber-50 text-amber-800 font-bold'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{rate} & above</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Only */}
              <div className="pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Listing Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl h-96 p-4 animate-pulse space-y-4">
                    <div className="bg-slate-200 aspect-square rounded-2xl" />
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg">No products found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn&apos;t find any travel gear matching your current filters. Try resetting the filters or broadening your search.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-6 py-2.5 rounded-full transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="text-xs font-bold text-slate-500 mb-4">
                  Showing {products.length} of {total} products
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Slide-Over Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-base">Filter Gear</h3>
                  <button onClick={() => setMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase text-slate-400 mb-2">Category</h4>
                  <div className="space-y-1 text-xs">
                    <button
                      onClick={() => { setSelectedCategory('all'); setMobileFilterOpen(false); }}
                      className="block w-full text-left py-1 font-medium"
                    >
                      All Categories
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => { setSelectedCategory(c.slug); setMobileFilterOpen(false); }}
                        className="block w-full text-left py-1 text-slate-600"
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl text-xs"
                >
                  Show Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
