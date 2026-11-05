'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { Cart, Product, ProductVariant } from '@/types';

interface CartContextType {
  cart: Cart;
  loading: boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => Promise<void>;
  updateQuantity: (variantId: string, slug: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<string>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
}

const defaultCart: Cart = {
  items: [],
  appliedCoupon: null,
  subtotal: 0,
  discount: 0,
  shipping: 0,
  total: 0
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(defaultCart);
  const [loading, setLoading] = useState<boolean>(true);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Initialize session ID
  useEffect(() => {
    let sessionId = localStorage.getItem('roamready_session_id');
    if (!sessionId) {
      sessionId = `sess_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('roamready_session_id', sessionId);
    }

    const savedCart = localStorage.getItem('roamready_local_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) { }
    }

    fetchCart();
  }, []);

  const saveLocalCart = (newCart: Cart) => {
    setCart(newCart);
    localStorage.setItem('roamready_local_cart', JSON.stringify(newCart));
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/cart');
      if (res.data.success && res.data.data?.cart) {
        saveLocalCart(res.data.data.cart);
      }
    } catch (e) {
      // offline/fallback: keep existing local cart
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (product: Product, variant?: ProductVariant, quantity: number = 1) => {
    const selectedVariant: ProductVariant = variant || product.variants[0] || {
      id: 'default',
      name: 'Standard',
      sku: product.sku,
      colorName: 'Standard',
      colorHex: '#0F172A',
      size: 'Standard',
      image: product.thumbnail,
      stockCount: product.stock,
      inStock: true
    };

    try {
      const res = await apiClient.post('/cart/items', {
        productSlug: product.slug,
        variantId: selectedVariant.id,
        quantity
      });
      if (res.data.success && res.data.data?.cart) {
        saveLocalCart(res.data.data.cart);
      }
    } catch (err: any) {
      // Local fallback calculation
      const items = [...cart.items];
      const existingIdx = items.findIndex(i => i.slug === product.slug && i.variantId === selectedVariant.id);
      if (existingIdx > -1) {
        items[existingIdx].quantity += quantity;
      } else {
        items.push({
          product: product._id,
          productIdString: product._id,
          slug: product.slug,
          title: product.title,
          sku: selectedVariant.sku,
          variantId: selectedVariant.id,
          price: product.price,
          image: selectedVariant.image || product.thumbnail,
          colorName: selectedVariant.colorName,
          size: selectedVariant.size,
          quantity
        });
      }
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
      saveLocalCart({ ...cart, items, subtotal, shipping, total: subtotal + shipping });
    }
    setIsCartOpen(true);
  };

  const updateQuantity = async (variantId: string, slug: string, quantity: number) => {
    try {
      const res = await apiClient.put('/cart/items', { variantId, slug, quantity });
      if (res.data.success && res.data.data?.cart) {
        saveLocalCart(res.data.data.cart);
      }
    } catch (e) {
      const items = cart.items
        .map(i => i.variantId === variantId ? { ...i, quantity } : i)
        .filter(i => i.quantity > 0);
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
      saveLocalCart({ ...cart, items, subtotal, shipping, total: subtotal + shipping });
    }
  };

  const removeItem = async (variantId: string) => {
    try {
      const res = await apiClient.delete(`/cart/items/${variantId}`);
      if (res.data.success && res.data.data?.cart) {
        saveLocalCart(res.data.data.cart);
      }
    } catch (e) {
      const items = cart.items.filter(i => i.variantId !== variantId);
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
      saveLocalCart({ ...cart, items, subtotal, shipping, total: subtotal + shipping });
    }
  };

  const applyCoupon = async (code: string): Promise<string> => {
    try {
      const res = await apiClient.post('/cart/coupon', { code });
      if (res.data.success && res.data.data?.cart) {
        saveLocalCart(res.data.data.cart);
        return res.data.message || 'Coupon applied!';
      }
      throw new Error(res.data.message || 'Invalid coupon');
    } catch (err: any) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to apply coupon');
    }
  };

  const removeCoupon = async () => {
    try {
      const res = await apiClient.delete('/cart/coupon');
      if (res.data.success && res.data.data?.cart) {
        saveLocalCart(res.data.data.cart);
      }
    } catch (e) {
      saveLocalCart({ ...cart, appliedCoupon: null, discount: 0, total: cart.subtotal + cart.shipping });
    }
  };

  const clearCart = async () => {
    try {
      await apiClient.delete('/cart');
    } catch (e) { }
    saveLocalCart(defaultCart);
  };

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        isCartOpen,
        setIsCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        applyCoupon,
        removeCoupon,
        clearCart,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
