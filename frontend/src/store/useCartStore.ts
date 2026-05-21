'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product, ProductVariant, OrderCustomization } from '@/types';

interface CartState {
  items:     CartItem[];
  isOpen:    boolean;
  addItem:   (product: Product, variant: ProductVariant, qty: number, customization?: OrderCustomization) => void;
  removeItem:(id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleCart:() => void;
  openCart:  () => void;
  closeCart: () => void;
  subtotal:  () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items:  [],
      isOpen: false,

      addItem: (product, variant, qty, customization) => {
        const existing = get().items.find(
          i => i.productId === product.id && i.variantId === variant.id
        );
        if (existing) {
          set(state => ({
            items: state.items.map(item =>
              item.id === existing.id
                ? { ...item, quantity: item.quantity + qty, totalPrice: (item.quantity + qty) * item.unitPrice }
                : item
            ),
          }));
        } else {
          const cartItem: CartItem = {
            id: `${product.id}-${variant.id}-${Date.now()}`,
            productId:    product.id,
            product,
            variantId:    variant.id,
            variant,
            quantity:     qty,
            customization,
            unitPrice:    variant.price,
            totalPrice:   variant.price * qty,
          };
          set(state => ({ items: [...state.items, cartItem] }));
        }
      },

      removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id);
          return;
        }
        set(state => ({
          items: state.items.map(item =>
            item.id === id
              ? { ...item, quantity: qty, totalPrice: qty * item.unitPrice }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
      openCart:   () => set({ isOpen: true }),
      closeCart:  () => set({ isOpen: false }),

      subtotal: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
      itemCount:() => get().items.reduce((sum, item) => sum + item.quantity, 0),
    }),
    {
      name: 'craftpack-cart',
      partialize: state => ({ items: state.items }),
    }
  )
);
