'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface WishlistContextType {
  wishlistSlugs: string[];
  toggleWishlist: (slug: string) => Promise<boolean>;
  isInWishlist: (slug: string) => boolean;
  wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistSlugs, setWishlistSlugs] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('roamready_wishlist');
    if (saved) {
      try {
        setWishlistSlugs(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveLocalWishlist = (slugs: string[]) => {
    setWishlistSlugs(slugs);
    localStorage.setItem('roamready_wishlist', JSON.stringify(slugs));
  };

  const toggleWishlist = async (slug: string): Promise<boolean> => {
    const isPresent = wishlistSlugs.includes(slug);
    let updated: string[];
    if (isPresent) {
      updated = wishlistSlugs.filter(s => s !== slug);
    } else {
      updated = [...wishlistSlugs, slug];
    }
    saveLocalWishlist(updated);

    try {
      await apiClient.post('/wishlist/toggle', { productIdOrSlug: slug });
    } catch (e) {}

    return !isPresent;
  };

  const isInWishlist = (slug: string): boolean => {
    return wishlistSlugs.includes(slug);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistSlugs,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlistSlugs.length
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
