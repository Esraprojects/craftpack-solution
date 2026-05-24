'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, ShoppingCart, Star, Leaf } from 'lucide-react';

const SAMPLE_PRODUCTS = [
  {
    id: 'k2', name: 'Kraft Bag — Medium (with Logo)', slug: 'kraft-bag-medium-logo',
    category: 'kraft_bags', thumbnail: '',
    basePrice: 45, rating: 4.9, reviewCount: 186,
    shortDescription: 'Medium kraft paper bag with your logo printed. Most popular size for retail, cafes, and boutique shops.',
    tags: ['Eco-Friendly', 'Custom Logo', 'Min. 200 pcs'],
    isEco: true, isBestseller: true,
    colors: ['#c8a97e', '#b8936a', '#a07850'],
    minOrder: 200,
  },
  {
    id: 'd2', name: 'White Duplex Bag — Medium (with Logo)', slug: 'duplex-bag-medium-logo',
    category: 'duplex_bags', thumbnail: '',
    basePrice: 53, rating: 4.9, reviewCount: 148,
    shortDescription: 'Premium white duplex bag with full-colour logo. Ideal for fashion, cosmetics, and high-end retail.',
    tags: ['Premium White', 'Full-Colour Print', 'Min. 200 pcs'],
    isEco: false, isBestseller: true,
    colors: ['#f0ece4', '#e8e2d8', '#d4c8b4'],
    minOrder: 200,
  },
  {
    id: 'b2', name: '1kg Cake Box (Window + Logo)', slug: 'cake-box-1kg-window-logo',
    category: 'cake_boxes', thumbnail: '',
    basePrice: 70, rating: 5.0, reviewCount: 178,
    shortDescription: '1kg cake box with PVC transparent window and custom logo. Perfect for patisseries, bakeries and gift shops.',
    tags: ['Transparent Window', 'Logo Print', 'Rigid Board'],
    isEco: false, isBestseller: true,
    colors: ['#fbbf24', '#fde68a', '#f59e0b'],
    minOrder: 200,
  },
  {
    id: 'k1', name: 'Kraft Bag — Small (with Logo)', slug: 'kraft-bag-small-logo',
    category: 'kraft_bags', thumbnail: '',
    basePrice: 39, rating: 4.9, reviewCount: 214,
    shortDescription: 'Small kraft bag with logo. Best for cafes, juice bars, and small boutique retail.',
    tags: ['Eco-Friendly', 'Logo Print', 'Min. 200 pcs'],
    isEco: true, isBestseller: true,
    colors: ['#c8a97e', '#d4b896', '#e0c8a8'],
    minOrder: 200,
  },
  {
    id: 'b7', name: '½kg Cake Box (with Logo)', slug: 'cake-box-half-logo',
    category: 'cake_boxes', thumbnail: '',
    basePrice: 45, rating: 4.9, reviewCount: 221,
    shortDescription: 'Half-kilo cake box with custom logo. Most popular for individual cakes, pastry slices, and take-away treats.',
    tags: ['Logo Print', 'Bakery Ready', 'Min. 200 pcs'],
    isEco: false, isBestseller: true,
    colors: ['#fef3c7', '#fde68a', '#fbbf24'],
    minOrder: 200,
  },
  {
    id: 'd1', name: 'White Duplex Bag — Small (with Logo)', slug: 'duplex-bag-small-logo',
    category: 'duplex_bags', thumbnail: '',
    basePrice: 43, rating: 5.0, reviewCount: 167,
    shortDescription: 'Small white duplex paper bag with logo print. Clean, bright and professional for any brand.',
    tags: ['Premium White', 'Logo Print', 'Min. 200 pcs'],
    isEco: false, isBestseller: true,
    colors: ['#f8f6f2', '#f0ece4', '#e8e2d8'],
    minOrder: 200,
  },
];

const categoryColors: Record<string, string> = {
  kraft_bags:    '#c8a97e',
  duplex_bags:   '#e8e2d8',
  cake_boxes:    '#fbbf24',
  raw_materials: '#64748b',
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
