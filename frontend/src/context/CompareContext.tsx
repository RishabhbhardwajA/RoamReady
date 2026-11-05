'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types';

interface CompareContextType {
  compareProducts: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (slug: string) => void;
  clearCompare: () => void;
  isComparing: (slug: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('roamready_compare');
    if (saved) {
      try {
        setCompareProducts(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const saveCompare = (prods: Product[]) => {
    setCompareProducts(prods);
    localStorage.setItem('roamready_compare', JSON.stringify(prods));
  };

  const addToCompare = (product: Product): boolean => {
    if (compareProducts.some(p => p.slug === product.slug)) {
      return false;
    }
    if (compareProducts.length >= 4) {
      alert('You can compare a maximum of 4 travel gear items at a time.');
      return false;
    }
    const updated = [...compareProducts, product];
    saveCompare(updated);
    return true;
  };

  const removeFromCompare = (slug: string) => {
    const updated = compareProducts.filter(p => p.slug !== slug);
    saveCompare(updated);
  };

  const clearCompare = () => {
    saveCompare([]);
  };

  const isComparing = (slug: string): boolean => {
    return compareProducts.some(p => p.slug === slug);
  };

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};

