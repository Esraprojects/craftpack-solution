'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ShoppingCart, Star, Leaf } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatCurrency } from '@/lib/utils';

const SAMPLE_PRODUCTS = [
  {
    id: '1', name: 'Premium Kraft Shopping Bag', slug: 'premium-kraft-shopping-bag',
    category: 'shopping_bags', thumbnail: '',
    basePrice: 12.50,  rating: 4.9, reviewCount: 128,
    shortDescription: 'Heavy-duty kraft paper with reinforced handles. Perfect for retail & boutique stores.',
    tags: ['Eco-Friendly', 'Custom Print', 'Bulk Available'],
    isEco: true, isBestseller: true,
    colors: ['#c8a97e', '#1e293b', '#0ea5e9'],
    minOrder: 500,
  },
  {
    id: '2', name: 'Luxury Matte Laminated Bag', slug: 'luxury-matte-laminated-bag',
    category: 'luxury_bags', thumbnail: '',
    basePrice: 28.00,  rating: 5.0, reviewCount: 64,
    shortDescription: 'Soft-touch matte lamination with gold foil stamping for premium brand experience.',
    tags: ['Luxury', 'Foil Stamp', 'Spot UV'],
    isEco: false, isBestseller: false,
    colors: ['#1e293b', '#1a1a2e', '#d4af37'],
    minOrder: 200,
  },
  {
    id: '3', name: 'Eco Recycled Paper Bag', slug: 'eco-recycled-paper-bag',
    category: 'eco_friendly', thumbnail: '',
    basePrice: 8.75,   rating: 4.8, reviewCount: 211,
    shortDescription: '100% recycled & biodegradable. FSC certified materials. Ideal for eco-conscious brands.',
    tags: ['100% Recycled', 'Biodegradable', 'FSC Certified'],
    isEco: true, isBestseller: true,
    colors: ['#4ade80', '#a3e635', '#fbbf24'],
    minOrder: 1000,
  },
  {
    id: '4', name: 'Food-Grade Paper Bag', slug: 'food-grade-paper-bag',
    category: 'food_packaging', thumbnail: '',
    basePrice: 6.50,   rating: 4.7, reviewCount: 183,
    shortDescription: 'Grease-resistant food-safe lining. Perfect for cafes, bakeries, and restaurants.',
    tags: ['Food Safe', 'Grease-Resistant', 'Custom Print'],
    isEco: true, isBestseller: false,
    colors: ['#fbbf24', '#f97316', '#ef4444'],
    minOrder: 2000,
  },
  {
    id: '5', name: 'Corporate Gift Box Bag', slug: 'corporate-gift-box-bag',
    category: 'gift_bags', thumbnail: '',
    basePrice: 35.00,  rating: 4.9, reviewCount: 47,
    shortDescription: 'Rigid gift box-style bag with magnetic closure. For premium corporate gifting.',
    tags: ['Rigid Box', 'Magnetic Closure', 'Premium'],
    isEco: false, isBestseller: false,
    colors: ['#0f172a', '#1e293b', '#7c3aed'],
    minOrder: 100,
  },
  {
    id: '6', name: 'Bulk Industrial Craft Bag', slug: 'bulk-industrial-craft-bag',
    category: 'industrial', thumbnail: '',
    basePrice: 4.20,   rating: 4.6, reviewCount: 95,
    shortDescription: 'Heavy-duty multi-wall kraft bags for industrial and wholesale applications.',
    tags: ['Industrial', 'Multi-wall', 'Heavy Duty'],
    isEco: true, isBestseller: false,
    colors: ['#a16207', '#92400e', '#78350f'],
    minOrder: 5000,
  },
];

const categoryColors: Record<string, string> = {
  shopping_bags:  '#0ea5e9',
  luxury_bags:    '#d4af37',
  eco_friendly:   '#4ade80',
  food_packaging: '#f97316',
  gift_bags:      '#a855f7',
  industrial:     '#64748b',
};

function ProductCard({ product, index }: { product: typeof SAMPLE_PRODUCTS[0]; index: number }) {
  const accentColor = categoryColors[product.category] ?? '#0ea5e9';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card card-hover group"
    >
      {/* Product image area */}
      <div className="relative h-52 rounded-t-2xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-700">
        {/* Simulated product visual */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-28 h-36 rounded-lg shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
            style={{
              background: `linear-gradient(135deg, ${accentColor}40, ${accentColor}20)`,
              border: `1px solid ${accentColor}30`,
              boxShadow: `0 20px 40px ${accentColor}20`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-display font-bold" style={{ color: accentColor, opacity: 0.5 }}>CP</div>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isBestseller && (
            <span className="badge bg-gold-500/20 text-gold-300 border border-gold-500/30">
              <Star className="w-2.5 h-2.5 fill-current" /> Bestseller
            </span>
          )}
          {product.isEco && (
            <span className="badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Leaf className="w-2.5 h-2.5" /> Eco
            </span>
          )}
        </div>

        {/* Color dots */}
        <div className="absolute top-3 right-3 flex gap-1">
          {product.colors.map((c, i) => (
            <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ background: c }} />
          ))}
        </div>

        {/* Quick add overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full btn-primary text-xs py-2 gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" /> Quick Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <div className="text-xs text-dark-500 mb-1 capitalize">{product.category.replace(/_/g, ' ')}</div>
          <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-brand-300 transition-colors">
            {product.name}
          </h3>
        </div>

        <p className="text-xs text-dark-400 line-clamp-2 leading-relaxed">{product.shortDescription}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/8 text-dark-400">{tag}</span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div>
            <div className="text-xs text-dark-500">from</div>
            <div className="text-base font-bold text-white">ETB {product.basePrice.toFixed(2)}</div>
            <div className="text-2xs text-dark-500">min. {product.minOrder.toLocaleString()} pcs</div>
          </div>
          <div className="flex items-center gap-1 text-xs text-dark-400">
            <Star className="w-3 h-3 text-gold-400 fill-current" />
            <span className="font-medium text-white">{product.rating}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="flex items-center justify-between text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors group/link"
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function FeaturedProducts() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-dark-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-1 bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider">
            <div className="w-8 h-px bg-brand-400" />
            Our Products
            <div className="w-8 h-px bg-brand-400" />
          </div>
          <h2 className="section-title">
            Packaging That <span className="gradient-text">Makes an Impression</span>
          </h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            From everyday retail bags to luxury branded packaging — engineered for impact, built for scale.
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {SAMPLE_PRODUCTS.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/products" className="btn-primary text-base px-10 py-4 group">
            View All Products
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
