'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Filter, Grid3X3, List, SlidersHorizontal, X, Star, Leaf, ShoppingCart, ArrowRight, ChevronDown, Package } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all',            label: 'All Products',    count: 48 },
  { id: 'paper_bags',     label: 'Paper Bags',       count: 12 },
  { id: 'shopping_bags',  label: 'Shopping Bags',    count: 10 },
  { id: 'luxury_bags',    label: 'Luxury Bags',      count: 8 },
  { id: 'food_packaging', label: 'Food Packaging',   count: 7 },
  { id: 'eco_friendly',   label: 'Eco-Friendly',     count: 6 },
  { id: 'gift_bags',      label: 'Gift Bags',        count: 3 },
  { id: 'industrial',     label: 'Industrial',       count: 2 },
];

const SAMPLE_PRODUCTS = [
  { id: '1',  name: 'Premium Kraft Shopping Bag',        slug: 'premium-kraft-shopping-bag',       category: 'shopping_bags',  basePrice: 12.50,  rating: 4.9, reviews: 128, isEco: true,  isBestseller: true,  minOrder: 500,  color: '#c8a97e' },
  { id: '2',  name: 'Luxury Matte Laminated Bag',        slug: 'luxury-matte-laminated-bag',       category: 'luxury_bags',    basePrice: 28.00,  rating: 5.0, reviews: 64,  isEco: false, isBestseller: false, minOrder: 200,  color: '#1e293b' },
  { id: '3',  name: 'Eco Recycled Paper Bag',            slug: 'eco-recycled-paper-bag',           category: 'eco_friendly',   basePrice: 8.75,   rating: 4.8, reviews: 211, isEco: true,  isBestseller: true,  minOrder: 1000, color: '#4ade80' },
  { id: '4',  name: 'Food-Grade Paper Bag',              slug: 'food-grade-paper-bag',             category: 'food_packaging', basePrice: 6.50,   rating: 4.7, reviews: 183, isEco: true,  isBestseller: false, minOrder: 2000, color: '#fbbf24' },
  { id: '5',  name: 'Corporate Gift Box Bag',            slug: 'corporate-gift-box-bag',           category: 'gift_bags',      basePrice: 35.00,  rating: 4.9, reviews: 47,  isEco: false, isBestseller: false, minOrder: 100,  color: '#7c3aed' },
  { id: '6',  name: 'Bulk Industrial Craft Bag',         slug: 'bulk-industrial-craft-bag',        category: 'industrial',     basePrice: 4.20,   rating: 4.6, reviews: 95,  isEco: true,  isBestseller: false, minOrder: 5000, color: '#78350f' },
  { id: '7',  name: 'Boutique Fashion Tote',             slug: 'boutique-fashion-tote',            category: 'shopping_bags',  basePrice: 18.00,  rating: 4.9, reviews: 87,  isEco: false, isBestseller: true,  minOrder: 300,  color: '#ec4899' },
  { id: '8',  name: 'Luxury Rigid Gift Bag',             slug: 'luxury-rigid-gift-bag',            category: 'luxury_bags',    basePrice: 45.00,  rating: 5.0, reviews: 32,  isEco: false, isBestseller: false, minOrder: 50,   color: '#d4af37' },
  { id: '9',  name: 'Bakery Window Paper Bag',           slug: 'bakery-window-paper-bag',          category: 'food_packaging', basePrice: 5.80,   rating: 4.7, reviews: 142, isEco: true,  isBestseller: false, minOrder: 1500, color: '#f97316' },
  { id: '10', name: 'White Gloss Laminated Bag',         slug: 'white-gloss-laminated-bag',        category: 'paper_bags',     basePrice: 15.00,  rating: 4.8, reviews: 76,  isEco: false, isBestseller: false, minOrder: 400,  color: '#e2e8f0' },
  { id: '11', name: 'Natural Brown Kraft Bag',           slug: 'natural-brown-kraft-bag',          category: 'paper_bags',     basePrice: 9.50,   rating: 4.6, reviews: 199, isEco: true,  isBestseller: true,  minOrder: 800,  color: '#a16207' },
  { id: '12', name: 'Premium Jewelry Gift Bag',          slug: 'premium-jewelry-gift-bag',         category: 'gift_bags',      basePrice: 52.00,  rating: 5.0, reviews: 18,  isEco: false, isBestseller: false, minOrder: 50,   color: '#c084fc' },
];

type ViewMode = 'grid' | 'list';
type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [sortBy,         setSortBy]         = useState<SortOption>('featured');
  const [showFilters,    setShowFilters]    = useState(false);
  const [priceRange,     setPriceRange]     = useState([0, 100]);
  const [ecoOnly,        setEcoOnly]        = useState(false);

  const filtered = useMemo(() => {
    let list = SAMPLE_PRODUCTS;
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }
    if (ecoOnly) list = list.filter(p => p.isEco);
    list = list.filter(p => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1]);

    switch (sortBy) {
      case 'price_asc':  return [...list].sort((a, b) => a.basePrice - b.basePrice);
      case 'price_desc': return [...list].sort((a, b) => b.basePrice - a.basePrice);
      case 'rating':     return [...list].sort((a, b) => b.rating - a.rating);
      default:           return list;
    }
  }, [activeCategory, searchQuery, sortBy, priceRange, ecoOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">
          <div className="w-8 h-px bg-brand-400" />
          Product Catalog
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
          Premium Packaging <span className="gradient-text">Solutions</span>
        </h1>
        <p className="text-dark-300 text-lg max-w-2xl">
          From retail bags to luxury packaging — find the perfect solution for your brand.
          All products available in custom sizes, colors, and branding.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <AnimatePresence>
          {(showFilters || typeof window !== 'undefined') && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 240, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="hidden lg:block flex-shrink-0 w-60 space-y-6"
            >
              {/* Categories */}
              <div>
                <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Category</h3>
                <div className="space-y-1">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors',
                        activeCategory === cat.id
                          ? 'bg-brand-600/20 text-brand-300 border border-brand-500/30'
                          : 'text-dark-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <span>{cat.label}</span>
                      <span className={cn('text-xs', activeCategory === cat.id ? 'text-brand-400' : 'text-dark-600')}>{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Eco Filter */}
              <div>
                <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Sustainability</h3>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    onClick={() => setEcoOnly(!ecoOnly)}
                    className={cn(
                      'w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer',
                      ecoOnly ? 'bg-emerald-600' : 'bg-dark-700'
                    )}
                  >
                    <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', ecoOnly ? 'translate-x-5' : 'translate-x-0.5')} />
                  </div>
                  <span className="text-sm text-dark-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    Eco-Friendly Only
                  </span>
                </label>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">
                  Price Range (ETB per unit)
                </h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={priceRange[1]}
                    onChange={e => setPriceRange([0, Number(e.target.value)])}
                    className="w-full accent-brand-500"
                  />
                  <div className="flex justify-between text-xs text-dark-500">
                    <span>ETB 0</span>
                    <span>ETB {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => { setActiveCategory('all'); setEcoOnly(false); setPriceRange([0, 100]); setSearchQuery(''); }}
                className="text-xs text-dark-500 hover:text-white transition-colors flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset Filters
              </button>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-2.5 text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-dark-400 hover:text-white" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="input-field pr-8 py-2.5 text-sm appearance-none cursor-pointer min-w-36"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Best Rated</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 p-1 rounded-xl bg-dark-800 border border-white/5">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'grid' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white')}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-2 rounded-lg transition-colors', viewMode === 'list' ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Results count */}
            <span className="text-sm text-dark-400 ml-auto">{filtered.length} products</span>
          </div>

          {/* Mobile category pills */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeCategory === cat.id
                    ? 'bg-brand-600 text-white'
                    : 'bg-dark-800 text-dark-400 hover:text-white'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                'grid gap-5',
                viewMode === 'grid'
                  ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1'
              )}
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className={cn('card card-hover group', viewMode === 'list' && 'flex gap-5')}
                >
                  {/* Image */}
                  <div className={cn(
                    'relative rounded-t-2xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-700',
                    viewMode === 'grid' ? 'h-48' : 'w-40 h-32 rounded-xl flex-shrink-0'
                  )}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-20 h-28 rounded-lg shadow-xl group-hover:scale-105 transition-transform duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${product.color}40, ${product.color}15)`,
                          border: `1px solid ${product.color}30`,
                        }}
                      />
                    </div>
                    {product.isBestseller && (
                      <span className="absolute top-2 left-2 badge bg-gold-500/20 text-gold-300 border border-gold-500/30">
                        <Star className="w-2.5 h-2.5 fill-current" /> Best
                      </span>
                    )}
                    {product.isEco && (
                      <span className="absolute top-2 right-2 badge bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Leaf className="w-2.5 h-2.5" /> Eco
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={cn('p-4 space-y-3', viewMode === 'list' && 'flex-1')}>
                    <div>
                      <p className="text-xs text-dark-500 capitalize mb-1">{product.category.replace(/_/g, ' ')}</p>
                      <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-gold-400 fill-current" />
                      <span className="text-xs font-medium text-white">{product.rating}</span>
                      <span className="text-xs text-dark-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-dark-500">from</div>
                        <div className="font-bold text-white">ETB {product.basePrice.toFixed(2)}</div>
                        <div className="text-xs text-dark-500">min. {product.minOrder.toLocaleString()} pcs</div>
                      </div>
                      <div className="flex gap-2">
                        <button className="btn-secondary text-xs px-3 py-2 gap-1">
                          <ShoppingCart className="w-3 h-3" />
                        </button>
                        <Link href={`/products/${product.slug}`} className="btn-primary text-xs px-3 py-2">
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-dark-600 mx-auto mb-4" />
              <p className="text-white font-medium">No products found</p>
              <p className="text-dark-400 text-sm mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
