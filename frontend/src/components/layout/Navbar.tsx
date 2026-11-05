'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Compass,
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Layers,
  Scale,
  Sparkles,
  ShieldCheck,
  Package,
  Lock,
  Tag,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { apiClient } from '@/lib/api';
import { Product } from '@/types';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { wishlistCount } = useWishlist();
  const { compareProducts } = useCompare();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search autocomplete
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await apiClient.get(`/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        if (res.data.success && res.data.data) {
          setSuggestions(res.data.data);
        }
      } catch (e) {}
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-2 z-40 px-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto rounded-full bg-white/80 backdrop-blur-xl border border-white/80 shadow-glass px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-brand-600 rounded-full focus:outline-none bg-white/60 border border-white/50"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-obsidian-900 flex items-center justify-center text-amber-accent shadow-md group-hover:scale-105 transition-transform border border-white/20">
              <Compass className="w-5 h-5 text-amber-accent" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-obsidian-900 font-sans flex items-center gap-1">
                ROAM<span className="text-brand-600">READY</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold -mt-1">
                Travel Precision
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-700">
            <Link href="/products" className="hover:text-brand-600 transition-colors">
              All Essentials
            </Link>
            <div className="relative group py-2">
              <button className="flex items-center gap-1 hover:text-brand-600 transition-colors">
                Categories <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <div className="absolute top-full left-0 w-64 glass-panel rounded-3xl p-3 shadow-glass-lg border border-white/80 backdrop-blur-2xl bg-white/90 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                <Link
                  href="/products?category=tsa-locks"
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-brand-50/80 text-slate-700 hover:text-brand-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                    <Lock className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">TSA Combination Locks</div>
                    <div className="text-[10px] text-slate-400 font-normal">Airport security compliant</div>
                  </div>
                </Link>
                <Link
                  href="/products?category=packing-cubes"
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-brand-50/80 text-slate-700 hover:text-brand-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                    <Package className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Compression Cubes</div>
                    <div className="text-[10px] text-slate-400 font-normal">Save up to 60% volume</div>
                  </div>
                </Link>
                <Link
                  href="/products?category=foldable-duffels"
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-brand-50/80 text-slate-700 hover:text-brand-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                    <Briefcase className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Foldable Duffel Bags</div>
                    <div className="text-[10px] text-slate-400 font-normal">Packable secondary luggage</div>
                  </div>
                </Link>
                <Link
                  href="/products?category=baggage-straps"
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-brand-50/80 text-slate-700 hover:text-brand-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Heavy-Duty Straps</div>
                    <div className="text-[10px] text-slate-400 font-normal">Reinforced cross buckles</div>
                  </div>
                </Link>
                <Link
                  href="/products?category=luggage-tags"
                  className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-brand-50/80 text-slate-700 hover:text-brand-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/80 flex items-center justify-center shadow-xs">
                    <Tag className="w-4 h-4 text-brand-600" />
                  </div>
                  <div>
                    <div className="text-xs font-bold">Privacy Luggage Tags</div>
                    <div className="text-[10px] text-slate-400 font-normal">Anodized aluminum shield</div>
                  </div>
                </Link>
              </div>
            </div>

            <Link href="/kits" className="flex items-center gap-1.5 text-amber-warm hover:text-amber-600 font-bold">
              <Layers className="w-4 h-4" /> Travel Kits
            </Link>

            <Link href="/finder" className="flex items-center gap-1.5 hover:text-brand-600">
              <Sparkles className="w-4 h-4 text-brand-600" /> Pack Finder
            </Link>

            <Link href="/compare" className="flex items-center gap-1.5 hover:text-brand-600">
              <Scale className="w-4 h-4" /> Compare
              {compareProducts.length > 0 && (
                <span className="bg-brand-100 text-brand-700 text-xs px-2 py-0.5 rounded-full font-bold">
                  {compareProducts.length}
                </span>
              )}
            </Link>
          </nav>

          {/* Search Bar (Curvy Glass Pill) */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-xs md:max-w-sm hidden sm:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search TSA locks, cubes, duffels..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-white/60 hover:bg-white/80 focus:bg-white text-xs md:text-sm text-slate-900 rounded-full pl-9 pr-4 py-2.5 border border-slate-200/80 focus:border-brand-500 focus:outline-none transition-all shadow-inner backdrop-blur-md"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </form>

            {/* Suggestions Dropdown (Curvy Glass Panel) */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-3xl shadow-glass-lg border border-white/80 p-2 z-50 overflow-hidden backdrop-blur-2xl bg-white/90">
                <div className="text-[11px] font-semibold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                  Suggested Products
                </div>
                {suggestions.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchQuery('');
                      router.push(`/products/${p.slug}`);
                    }}
                    className="w-full text-left flex items-center gap-3 p-2.5 hover:bg-brand-50/80 rounded-2xl transition-colors"
                  >
                    <img src={p.thumbnail} alt={p.title} className="w-10 h-10 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">{p.title}</div>
                      <div className="text-[11px] text-brand-600 font-bold">₹{p.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons: Wishlist, Account, Cart */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="relative w-10 h-10 flex items-center justify-center text-slate-700 hover:text-rose-500 hover:bg-rose-50/80 rounded-full transition-all border border-transparent hover:border-rose-200/60"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Account Menu */}
            <div className="relative">
              <button
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="w-10 h-10 flex items-center justify-center text-slate-700 hover:text-brand-600 hover:bg-white/80 rounded-full transition-all border border-transparent hover:border-slate-200"
                aria-label="User Account"
              >
                <UserIcon className="w-5 h-5" />
              </button>

              {accountMenuOpen && (
                <div
                  onMouseLeave={() => setAccountMenuOpen(false)}
                  className="absolute right-0 mt-2 w-56 glass-panel rounded-3xl shadow-glass-lg border border-white/80 py-2.5 z-50 text-sm backdrop-blur-2xl bg-white/95"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="font-bold text-slate-900 text-xs truncate">{user.name}</div>
                        <div className="text-slate-400 text-[11px] truncate">{user.email}</div>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Admin Account
                          </span>
                        )}
                      </div>
                      <Link
                        href="/account"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors rounded-xl mx-1"
                      >
                        My Profile & Addresses
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors rounded-xl mx-1"
                      >
                        My Orders & Tracking
                      </Link>
                      {user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-brand-600 font-bold hover:bg-brand-50 transition-colors rounded-xl mx-1"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => {
                          logout();
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors rounded-xl"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-xs text-slate-500 font-medium">Welcome to RoamReady</div>
                      <Link
                        href="/auth/login"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-slate-900 font-bold hover:bg-slate-50 transition-colors rounded-xl mx-1"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-brand-600 hover:bg-brand-50 transition-colors rounded-xl mx-1"
                      >
                        Create an Account
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      <Link
                        href="/admin"
                        onClick={() => setAccountMenuOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 rounded-xl mx-1"
                      >
                        Admin Portal
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-obsidian-950/90 hover:bg-obsidian-950 text-white px-4 py-2.5 rounded-full font-semibold text-xs md:text-sm transition-all shadow-md active:scale-95 border border-white/20 backdrop-blur-md"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-amber-accent" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-amber-accent text-obsidian-950 text-xs px-2 py-0.5 rounded-full font-extrabold">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 glass-panel rounded-3xl border border-white/80 bg-white/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-3 shadow-glass-lg">
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search travel gear..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/80 rounded-full pl-9 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50 text-slate-800"
            >
              All Essentials
            </Link>
            <Link
              href="/kits"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-amber-50 text-amber-800 font-bold"
            >
              Travel Kits
            </Link>
            <Link
              href="/products?category=tsa-locks"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50 text-slate-800"
            >
              TSA Locks
            </Link>
            <Link
              href="/products?category=packing-cubes"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50 text-slate-800"
            >
              Packing Cubes
            </Link>
            <Link
              href="/products?category=foldable-duffels"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50 text-slate-800"
            >
              Foldable Duffels
            </Link>
            <Link
              href="/products?category=baggage-straps"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50 text-slate-800"
            >
              Baggage Straps
            </Link>
            <Link
              href="/products?category=luggage-tags"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-slate-50 text-slate-800"
            >
              Luggage Tags
            </Link>
            <Link
              href="/finder"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 rounded-2xl bg-blue-50 text-blue-800 font-bold"
            >
              Pack Finder
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

