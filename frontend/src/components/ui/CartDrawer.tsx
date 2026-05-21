'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQty, subtotal, itemCount } = useCartStore();
  const total = subtotal();
  const count = itemCount();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-dark-900 border-l border-white/5 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-brand-400" />
                <h2 className="font-display font-bold text-white text-lg">
                  Your Cart
                  {count > 0 && (
                    <span className="ml-2 text-sm font-normal text-dark-400">({count} items)</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-white/5 text-dark-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-white/5 flex items-center justify-center">
                    <Package className="w-7 h-7 text-dark-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Your cart is empty</p>
                    <p className="text-dark-400 text-sm mt-1">Add products to get started</p>
                  </div>
                  <Link href="/products" onClick={closeCart} className="btn-primary text-sm px-6 py-2.5">
                    Browse Products
                  </Link>
                </div>
              ) : (
                items.map(item => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 p-4 rounded-2xl bg-dark-800/60 border border-white/5"
                  >
                    {/* Product color swatch */}
                    <div className="w-16 h-20 rounded-xl bg-gradient-to-br from-brand-900 to-dark-800 border border-white/5 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-brand-400/40" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-dark-400 mt-0.5">{item.variant.name}</p>
                      {item.customization?.customText && (
                        <p className="text-xs text-brand-400 mt-0.5">Custom: {item.customization.customText}</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-dark-700 hover:bg-dark-600 text-white flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm text-white w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-dark-700 hover:bg-dark-600 text-white flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">
                            {formatCurrency(item.totalPrice)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 rounded hover:bg-red-500/10 text-dark-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-white/5 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-dark-400">
                    <span>Subtotal ({count} items)</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-dark-400">
                    <span>Tax (15% VAT)</span>
                    <span>{formatCurrency(total * 0.15)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5">
                    <span>Total</span>
                    <span>{formatCurrency(total * 1.15)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full justify-center text-sm group"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full text-center text-sm text-dark-400 hover:text-white transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
