'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Grid3X3, List, X, Star, Leaf, ShoppingCart, ChevronDown, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'all',            label: 'All Products',         count: 37 },
  { id: 'kraft_bags',     label: 'Kraft Paper Bags',     count: 8  },
  { id: 'duplex_bags',    label: 'White Duplex Bags',    count: 8  },
  { id: 'cake_boxes',     label: 'Cake & Cookies Boxes', count: 9  },
  { id: 'raw_materials',  label: 'Raw Materials',        count: 12 },
];

const SAMPLE_PRODUCTS = [
  /* ── Kraft Paper Bags ── */
  { id: 'k1',  name: 'Kraft Bag — Small (with Logo)',       slug: 'kraft-bag-small-logo',      category: 'kraft_bags',    basePrice: 39, rating: 4.9, reviews: 214, isEco: true,  isBestseller: true,  minOrder: 200, color: '#c8a97e', tag: 'With Logo'  },
  { id: 'k2',  name: 'Kraft Bag — Medium (with Logo)',      slug: 'kraft-bag-medium-logo',     category: 'kraft_bags',    basePrice: 45, rating: 4.9, reviews: 186, isEco: true,  isBestseller: true,  minOrder: 200, color: '#b8936a', tag: 'With Logo'  },
  { id: 'k3',  name: 'Kraft Bag — Large (with Logo)',       slug: 'kraft-bag-large-logo',      category: 'kraft_bags',    basePrice: 53, rating: 4.8, reviews: 142, isEco: true,  isBestseller: false, minOrder: 200, color: '#a07850', tag: 'With Logo'  },
  { id: 'k4',  name: 'Kraft Bag — Extra Large (with Logo)', slug: 'kraft-bag-xl-logo',         category: 'kraft_bags',    basePrice: 60, rating: 4.8, reviews: 98,  isEco: true,  isBestseller: false, minOrder: 200, color: '#8c6438', tag: 'With Logo'  },
  { id: 'k5',  name: 'Kraft Bag — Small (Plain)',           slug: 'kraft-bag-small-plain',     category: 'kraft_bags',    basePrice: 29, rating: 4.7, reviews: 310, isEco: true,  isBestseller: true,  minOrder: 200, color: '#d4b896', tag: 'Plain'      },
  { id: 'k6',  name: 'Kraft Bag — Medium (Plain)',          slug: 'kraft-bag-medium-plain',    category: 'kraft_bags',    basePrice: 32, rating: 4.7, reviews: 278, isEco: true,  isBestseller: false, minOrder: 200, color: '#c8a87c', tag: 'Plain'      },
  { id: 'k7',  name: 'Kraft Bag — Large (Plain)',           slug: 'kraft-bag-large-plain',     category: 'kraft_bags',    basePrice: 37, rating: 4.6, reviews: 201, isEco: true,  isBestseller: false, minOrder: 200, color: '#b89060', tag: 'Plain'      },
  { id: 'k8',  name: 'Kraft Bag — Extra Large (Plain)',     slug: 'kraft-bag-xl-plain',        category: 'kraft_bags',    basePrice: 47, rating: 4.6, reviews: 134, isEco: true,  isBestseller: false, minOrder: 200, color: '#a07844', tag: 'Plain'      },
  /* ── White Duplex Bags ── */
  { id: 'd1',  name: 'White Duplex Bag — Small (with Logo)',       slug: 'duplex-bag-small-logo',  category: 'duplex_bags',   basePrice: 43, rating: 5.0, reviews: 167, isEco: false, isBestseller: true,  minOrder: 200, color: '#f0ece4', tag: 'With Logo'  },
  { id: 'd2',  name: 'White Duplex Bag — Medium (with Logo)',      slug: 'duplex-bag-medium-logo', category: 'duplex_bags',   basePrice: 53, rating: 4.9, reviews: 148, isEco: false, isBestseller: true,  minOrder: 200, color: '#e8e2d8', tag: 'With Logo'  },
  { id: 'd3',  name: 'White Duplex Bag — Large (with Logo)',       slug: 'duplex-bag-large-logo',  category: 'duplex_bags',   basePrice: 60, rating: 4.9, reviews: 112, isEco: false, isBestseller: false, minOrder: 200, color: '#e0d8cc', tag: 'With Logo'  },
  { id: 'd4',  name: 'White Duplex Bag — Extra Large (with Logo)', slug: 'duplex-bag-xl-logo',     category: 'duplex_bags',   basePrice: 75, rating: 4.8, reviews: 76,  isEco: false, isBestseller: false, minOrder: 200, color: '#d8d0c4', tag: 'With Logo'  },
  { id: 'd5',  name: 'White Duplex Bag — Small (Plain)',           slug: 'duplex-bag-small-plain', category: 'duplex_bags',   basePrice: 33, rating: 4.7, reviews: 189, isEco: false, isBestseller: false, minOrder: 200, color: '#f8f6f0', tag: 'Plain'      },
  { id: 'd6',  name: 'White Duplex Bag — Medium (Plain)',          slug: 'duplex-bag-medium-plain',category: 'duplex_bags',   basePrice: 43, rating: 4.7, reviews: 152, isEco: false, isBestseller: false, minOrder: 200, color: '#f4f0e8', tag: 'Plain'      },
  { id: 'd7',  name: 'White Duplex Bag — Large (Plain)',           slug: 'duplex-bag-large-plain', category: 'duplex_bags',   basePrice: 53, rating: 4.6, reviews: 118, isEco: false, isBestseller: false, minOrder: 200, color: '#eeeae0', tag: 'Plain'      },
  { id: 'd8',  name: 'White Duplex Bag — Extra Large (Plain)',     slug: 'duplex-bag-xl-plain',    category: 'duplex_bags',   basePrice: 65, rating: 4.6, reviews: 84,  isEco: false, isBestseller: false, minOrder: 200, color: '#e8e2d8', tag: 'Plain'      },
  /* ── Cake & Cookies Boxes ── */
  { id: 'b1',  name: '1kg Cake Box (with Logo)',                    slug: 'cake-box-1kg-logo',          category: 'cake_boxes',    basePrice: 60, rating: 4.9, reviews: 203, isEco: false, isBestseller: true,  minOrder: 200, color: '#fde68a', tag: '1kg'        },
  { id: 'b2',  name: '1kg Cake Box (Window + Logo)',                slug: 'cake-box-1kg-window-logo',   category: 'cake_boxes',    basePrice: 70, rating: 5.0, reviews: 178, isEco: false, isBestseller: true,  minOrder: 200, color: '#fbbf24', tag: '1kg Window' },
  { id: 'b3',  name: '2kg Cake Box (with Logo)',                    slug: 'cake-box-2kg-logo',          category: 'cake_boxes',    basePrice: 80, rating: 4.8, reviews: 134, isEco: false, isBestseller: false, minOrder: 200, color: '#f59e0b', tag: '2kg'        },
  { id: 'b4',  name: '2kg Cookies Box (Window + Logo)',             slug: 'cookies-box-2kg-window-logo',category: 'cake_boxes',    basePrice: 90, rating: 4.8, reviews: 98,  isEco: false, isBestseller: false, minOrder: 200, color: '#d97706', tag: '2kg Window' },
  { id: 'b5',  name: '1kg Cookies Box (with Logo)',                 slug: 'cookies-box-1kg-logo',       category: 'cake_boxes',    basePrice: 55, rating: 4.7, reviews: 156, isEco: false, isBestseller: false, minOrder: 200, color: '#fde68a', tag: '1kg'        },
  { id: 'b6',  name: '1kg Cookies Box (Window + Logo)',             slug: 'cookies-box-1kg-window-logo',category: 'cake_boxes',    basePrice: 65, rating: 4.8, reviews: 142, isEco: false, isBestseller: false, minOrder: 200, color: '#fbbf24', tag: '1kg Window' },
  { id: 'b7',  name: '½kg Cake Box (with Logo)',                    slug: 'cake-box-half-logo',         category: 'cake_boxes',    basePrice: 45, rating: 4.9, reviews: 221, isEco: false, isBestseller: true,  minOrder: 200, color: '#fef3c7', tag: '½kg'        },
  { id: 'b8',  name: '½kg Cookies Box (Window + Logo)',             slug: 'cookies-box-half-window',    category: 'cake_boxes',    basePrice: 50, rating: 4.8, reviews: 187, isEco: false, isBestseller: false, minOrder: 200, color: '#fde68a', tag: '½kg Window' },
  { id: 'b9',  name: '½kg Cookies Box (with Logo)',                 slug: 'cookies-box-half-logo',      category: 'cake_boxes',    basePrice: 60, rating: 4.7, reviews: 163, isEco: false, isBestseller: false, minOrder: 200, color: '#fbbf24', tag: '½kg'        },
  /* ── Raw Materials ── */
  { id: 'r1',  name: 'Silkscreen Frame',                slug: 'silkscreen-frame',         category: 'raw_materials', basePrice: 0, rating: 4.8, reviews: 56,  isEco: false, isBestseller: false, minOrder: 1, color: '#94a3b8', tag: 'Tool'     },
  { id: 'r2',  name: 'Silkscreen Printer (1-Handle)',   slug: 'silkscreen-printer-1h',    category: 'raw_materials', basePrice: 0, rating: 4.9, reviews: 43,  isEco: false, isBestseller: false, minOrder: 1, color: '#64748b', tag: 'Tool'     },
  { id: 'r3',  name: 'Silkscreen Printer (2-Handle)',   slug: 'silkscreen-printer-2h',    category: 'raw_materials', basePrice: 0, rating: 4.9, reviews: 38,  isEco: false, isBestseller: false, minOrder: 1, color: '#475569', tag: 'Tool'     },
  { id: 'r4',  name: 'Silkscreen Printer (4-Handle)',   slug: 'silkscreen-printer-4h',    category: 'raw_materials', basePrice: 0, rating: 5.0, reviews: 29,  isEco: false, isBestseller: false, minOrder: 1, color: '#334155', tag: 'Tool'     },
  { id: 'r5',  name: 'Eyelet Puncher',                  slug: 'eyelet-puncher',           category: 'raw_materials', basePrice: 0, rating: 4.7, reviews: 62,  isEco: false, isBestseller: false, minOrder: 1, color: '#78716c', tag: 'Tool'     },
  { id: 'r6',  name: 'Rope Handle — 300m Roll',         slug: 'rope-handle-300m',         category: 'raw_materials', basePrice: 0, rating: 4.8, reviews: 89,  isEco: true,  isBestseller: true,  minOrder: 1, color: '#c8a97e', tag: 'Material' },
  { id: 'r7',  name: 'Water-Based Ink',                 slug: 'water-based-ink',          category: 'raw_materials', basePrice: 0, rating: 4.8, reviews: 74,  isEco: true,  isBestseller: false, minOrder: 1, color: '#22d3ee', tag: 'Ink'      },
  { id: 'r8',  name: 'Plastisol Ink',                   slug: 'plastisol-ink',            category: 'raw_materials', basePrice: 0, rating: 4.7, reviews: 67,  isEco: false, isBestseller: false, minOrder: 1, color: '#f59e0b', tag: 'Ink'      },
  { id: 'r9',  name: 'Aluminium Squeegee — 20cm',       slug: 'squeegee-20cm',            category: 'raw_materials', basePrice: 0, rating: 4.8, reviews: 91,  isEco: false, isBestseller: false, minOrder: 1, color: '#94a3b8', tag: '20cm'     },
  { id: 'r10', name: 'Aluminium Squeegee — 30cm',       slug: 'squeegee-30cm',            category: 'raw_materials', basePrice: 0, rating: 4.9, reviews: 118, isEco: false, isBestseller: true,  minOrder: 1, color: '#64748b', tag: '30cm'     },
  { id: 'r11', name: 'Aluminium Squeegee — 45cm',       slug: 'squeegee-45cm',            category: 'raw_materials', basePrice: 0, rating: 4.8, reviews: 76,  isEco: false, isBestseller: false, minOrder: 1, color: '#475569', tag: '45cm'     },
  { id: 'r12', name: 'Light Box (Exposure Unit)',        slug: 'light-box-exposure',       category: 'raw_materials', basePrice: 0, rating: 4.9, reviews: 51,  isEco: false, isBestseller: false, minOrder: 1, color: '#fbbf24', tag: 'Equipment'},
];

type ViewMode = 'grid' | 'list';
type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'rating' | 'newest';

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [sortBy,         setSortBy]         = useState<SortOption>('featured');
  const [showFilters] = useState(false);
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
                        <div className="font-bold text-white">
                          {product.basePrice > 0 ? `ETB ${product.basePrice}` : 'Contact for price'}
                        </div>
                        <div className="text-xs text-dark-500">min. {product.minOrder.toLocaleString()} {product.minOrder === 1 ? 'unit' : 'pcs'}</div>
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
