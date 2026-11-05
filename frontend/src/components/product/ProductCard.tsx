'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ShoppingBag, Check, ShieldCheck, Scale } from 'lucide-react';
import { Product, ProductVariant } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCompare } from '@/context/CompareContext';
import { formatINR } from '@/lib/api';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCompare, isComparing, removeFromCompare } = useCompare();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants?.[0] || {
      id: 'default',
      name: 'Standard',
      sku: product.sku,
      colorName: 'Standard',
      colorHex: '#0F172A',
      size: 'Standard',
      image: product.thumbnail,
      stockCount: product.stock,
      inStock: true
    }
  );

  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.slug);
  const comparing = isComparing(product.slug);

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    await addItem(product, selectedVariant, 1);
    setIsAdding(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.slug);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (comparing) {
      removeFromCompare(product.slug);
    } else {
      addToCompare(product);
    }
  };

  return (
    <div className="group relative glass-card rounded-3xl p-3 border border-white/80 shadow-glass hover:shadow-glass-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full bg-white/75 backdrop-blur-xl">
      {/* Top Media & Badges */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100/60 to-slate-200/40">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={selectedVariant.image || product.thumbnail}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-2xl"
          />
        </Link>

        {/* Badges on Top Left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span className="backdrop-blur-md bg-obsidian-950/90 text-amber-accent text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm border border-white/10">
              {product.badge}
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="backdrop-blur-md bg-rose-600/90 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-sm border border-white/20">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.specifications?.tsaApproved && (
            <span className="backdrop-blur-md bg-brand-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
              <ShieldCheck className="w-3 h-3" /> TSA
            </span>
          )}
        </div>

        {/* Action Buttons Top Right: Wishlist & Compare (Glassy Pills) */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleWishlistClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md border border-white/70 ${
              isFavorited
                ? 'bg-rose-50 text-rose-500 scale-110 border-rose-200'
                : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-white hover:scale-110'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={handleCompareClick}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md backdrop-blur-md border border-white/70 ${
              comparing
                ? 'bg-brand-600 text-white scale-105 border-brand-400'
                : 'bg-white/80 text-slate-500 hover:text-brand-600 hover:bg-white hover:scale-110'
            }`}
            title={comparing ? 'Remove from comparison' : 'Add to compare'}
            aria-label="Compare"
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Overlay on Hover (Curvy Glass Pill) */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            disabled={isAdding || product.stock === 0}
            className="w-full bg-obsidian-950/90 hover:bg-black text-white text-xs font-bold py-3 px-4 rounded-full backdrop-blur-xl flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all border border-white/20"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added to Bag!</span>
              </>
            ) : product.stock === 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-amber-accent" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-slate-700 bg-white/70 backdrop-blur-md px-2.5 py-0.5 rounded-full font-semibold text-[11px] border border-slate-200/60 shadow-xs">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-light">
            {product.shortDescription}
          </p>
        </div>

        {/* Variants Swatches & Pricing */}
        <div className="mt-4 pt-3 border-t border-slate-200/50">
          {product.variants && product.variants.length > 1 && (
            <div className="flex items-center gap-1.5 mb-2.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedVariant(v);
                  }}
                  className={`w-4 h-4 rounded-full border transition-all ${
                    selectedVariant.id === v.id
                      ? 'ring-2 ring-brand-500 ring-offset-1 scale-110'
                      : 'border-slate-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: v.colorHex }}
                  title={v.colorName}
                />
              ))}
              <span className="text-[10px] text-slate-400 ml-1">
                {product.variants.length} colors
              </span>
            </div>
          )}

          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                {formatINR(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>
            <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50/90 backdrop-blur-md border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
              In Stock
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

