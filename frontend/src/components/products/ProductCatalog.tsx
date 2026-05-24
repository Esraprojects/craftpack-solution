'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Search, Grid3X3, List, X, Star, Leaf, ShoppingCart, ChevronDown, Package, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ── Categories ──────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',           label: 'All Products',         count: 25 },
  { id: 'kraft_bags',    label: 'Kraft Paper Bags',     count: 4  },
  { id: 'duplex_bags',   label: 'White Duplex Bags',    count: 4  },
  { id: 'cake_boxes',    label: 'Cake & Cookies Boxes', count: 9  },
  { id: 'raw_materials', label: 'Raw Materials',        count: 12 },
];

/* ── Grouped products (bags) — each size has with-logo + plain ── */
interface BagVariant { label: string; price: number; slug: string }
interface GroupedProduct {
  id: string; name: string; category: 'kraft_bags' | 'duplex_bags';
  variants: [BagVariant, BagVariant];
  rating: number; reviews: number; isEco: boolean; isBestseller: boolean;
  minOrder: number; color: string; desc: string;
}

const GROUPED: GroupedProduct[] = [
  /* Kraft */
  { id:'kg-s', name:'Kraft Paper Bag — Small',       category:'kraft_bags',  variants:[{label:'With Logo',price:39,slug:'kraft-bag-small-logo'},{label:'Plain',price:29,slug:'kraft-bag-small-plain'}],       rating:4.9, reviews:214, isEco:true,  isBestseller:true,  minOrder:200, color:'#c8a97e', desc:'Best for cafes, juice bars and small boutique retail.' },
  { id:'kg-m', name:'Kraft Paper Bag — Medium',      category:'kraft_bags',  variants:[{label:'With Logo',price:45,slug:'kraft-bag-medium-logo'},{label:'Plain',price:32,slug:'kraft-bag-medium-plain'}],     rating:4.9, reviews:186, isEco:true,  isBestseller:true,  minOrder:200, color:'#b8936a', desc:'Most popular size. Ideal for retail, bakeries and gift shops.' },
  { id:'kg-l', name:'Kraft Paper Bag — Large',       category:'kraft_bags',  variants:[{label:'With Logo',price:53,slug:'kraft-bag-large-logo'},{label:'Plain',price:37,slug:'kraft-bag-large-plain'}],       rating:4.8, reviews:142, isEco:true,  isBestseller:false, minOrder:200, color:'#a07850', desc:'Ideal for supermarkets, garments and large retail orders.' },
  { id:'kg-x', name:'Kraft Paper Bag — Extra Large', category:'kraft_bags',  variants:[{label:'With Logo',price:60,slug:'kraft-bag-xl-logo'},{label:'Plain',price:47,slug:'kraft-bag-xl-plain'}],             rating:4.8, reviews:98,  isEco:true,  isBestseller:false, minOrder:200, color:'#8c6438', desc:'For wholesalers, event gifting and corporate bulk orders.' },
  /* White Duplex */
  { id:'dg-s', name:'White Duplex Bag — Small',       category:'duplex_bags', variants:[{label:'With Logo',price:43,slug:'duplex-bag-small-logo'},{label:'Plain',price:33,slug:'duplex-bag-small-plain'}],    rating:5.0, reviews:167, isEco:false, isBestseller:true,  minOrder:200, color:'#f0ece4', desc:'Clean white finish. Perfect for cosmetics and small boutiques.' },
  { id:'dg-m', name:'White Duplex Bag — Medium',      category:'duplex_bags', variants:[{label:'With Logo',price:53,slug:'duplex-bag-medium-logo'},{label:'Plain',price:43,slug:'duplex-bag-medium-plain'}],  rating:4.9, reviews:148, isEco:false, isBestseller:true,  minOrder:200, color:'#e8e2d8', desc:'Premium look for fashion brands and high-end retail.' },
  { id:'dg-l', name:'White Duplex Bag — Large',       category:'duplex_bags', variants:[{label:'With Logo',price:60,slug:'duplex-bag-large-logo'},{label:'Plain',price:53,slug:'duplex-bag-large-plain'}],    rating:4.9, reviews:112, isEco:false, isBestseller:false, minOrder:200, color:'#e0d8cc', desc:'Excellent for upscale retail, hotels and corporate gifts.' },
  { id:'dg-x', name:'White Duplex Bag — Extra Large', category:'duplex_bags', variants:[{label:'With Logo',price:75,slug:'duplex-bag-xl-logo'},{label:'Plain',price:65,slug:'duplex-bag-xl-plain'}],          rating:4.8, reviews:76,  isEco:false, isBestseller:false, minOrder:200, color:'#d8d0c4', desc:'Luxury large-format bag for premium brands and events.' },
];

/* ── Individual products (boxes + raw materials) ─────────────── */
interface SingleProduct {
  id: string; name: string; slug: string; category: string;
  basePrice: number; rating: number; reviews: number;
  isEco: boolean; isBestseller: boolean; minOrder: number;
  color: string; tag: string; desc: string;
}

const SINGLES: SingleProduct[] = [
  /* Cake & Cookie Boxes */
  { id:'b1', name:'1kg Cake Box (with Logo)',             slug:'cake-box-1kg-logo',          category:'cake_boxes',   basePrice:60, rating:4.9, reviews:203, isEco:false, isBestseller:true,  minOrder:200, color:'#fde68a', tag:'1kg',        desc:'Rigid cake box with custom logo. Ideal for bakeries and patisseries.' },
  { id:'b2', name:'1kg Cake Box (Window + Logo)',         slug:'cake-box-1kg-window-logo',   category:'cake_boxes',   basePrice:70, rating:5.0, reviews:178, isEco:false, isBestseller:true,  minOrder:200, color:'#fbbf24', tag:'1kg Window', desc:'PVC window box with logo. Perfect for premium display and gifting.' },
  { id:'b3', name:'2kg Cake Box (with Logo)',             slug:'cake-box-2kg-logo',          category:'cake_boxes',   basePrice:80, rating:4.8, reviews:134, isEco:false, isBestseller:false, minOrder:200, color:'#f59e0b', tag:'2kg',        desc:'Large cake box for wedding cakes and catering orders.' },
  { id:'b4', name:'2kg Cookies Box (Window + Logo)',      slug:'cookies-box-2kg-window-logo',category:'cake_boxes',   basePrice:90, rating:4.8, reviews:98,  isEco:false, isBestseller:false, minOrder:200, color:'#d97706', tag:'2kg Window', desc:'2kg display box with window — showroom-ready packaging.' },
  { id:'b5', name:'1kg Cookies Box (with Logo)',          slug:'cookies-box-1kg-logo',       category:'cake_boxes',   basePrice:55, rating:4.7, reviews:156, isEco:false, isBestseller:false, minOrder:200, color:'#fde68a', tag:'1kg',        desc:'Standard cookie box with logo for bakeries and sweet shops.' },
  { id:'b6', name:'1kg Cookies Box (Window + Logo)',      slug:'cookies-box-1kg-window-logo',category:'cake_boxes',   basePrice:65, rating:4.8, reviews:142, isEco:false, isBestseller:false, minOrder:200, color:'#fbbf24', tag:'1kg Window', desc:'Display-ready 1kg cookie box with PVC window and logo.' },
  { id:'b7', name:'½kg Cake Box (with Logo)',             slug:'cake-box-half-logo',         category:'cake_boxes',   basePrice:45, rating:4.9, reviews:221, isEco:false, isBestseller:true,  minOrder:200, color:'#fef3c7', tag:'½kg',        desc:'Most popular for mini cakes, pastry slices and take-away.' },
  { id:'b8', name:'½kg Cookies Box (Window + Logo)',      slug:'cookies-box-half-window',    category:'cake_boxes',   basePrice:50, rating:4.8, reviews:187, isEco:false, isBestseller:false, minOrder:200, color:'#fde68a', tag:'½kg Window', desc:'Gift-ready half-kilo cookie box with transparent display window.' },
  { id:'b9', name:'½kg Cookies Box (with Logo)',          slug:'cookies-box-half-logo',      category:'cake_boxes',   basePrice:60, rating:4.7, reviews:163, isEco:false, isBestseller:false, minOrder:200, color:'#fbbf24', tag:'½kg',        desc:'Compact take-away cookie box with tuck-top closure and logo.' },
  /* Raw Materials */
  { id:'r1',  name:'Silkscreen Frame',                slug:'silkscreen-frame',        category:'raw_materials', basePrice:0, rating:4.8, reviews:56,  isEco:false, isBestseller:false, minOrder:1, color:'#94a3b8', tag:'Tool',      desc:'Professional aluminium silkscreen frame. Various mesh sizes available.' },
  { id:'r2',  name:'Silkscreen Printer — 1 Handle',  slug:'silkscreen-printer-1h',   category:'raw_materials', basePrice:0, rating:4.9, reviews:43,  isEco:false, isBestseller:false, minOrder:1, color:'#64748b', tag:'Tool',      desc:'Single-handle desktop silkscreen press for small-scale printing.' },
  { id:'r3',  name:'Silkscreen Printer — 2 Handle',  slug:'silkscreen-printer-2h',   category:'raw_materials', basePrice:0, rating:4.9, reviews:38,  isEco:false, isBestseller:false, minOrder:1, color:'#475569', tag:'Tool',      desc:'Two-handle press for improved stability and consistent results.' },
  { id:'r4',  name:'Silkscreen Printer — 4 Handle',  slug:'silkscreen-printer-4h',   category:'raw_materials', basePrice:0, rating:5.0, reviews:29,  isEco:false, isBestseller:false, minOrder:1, color:'#334155', tag:'Tool',      desc:'Professional 4-handle press for high-volume printing operations.' },
  { id:'r5',  name:'Eyelet Puncher',                  slug:'eyelet-puncher',          category:'raw_materials', basePrice:0, rating:4.7, reviews:62,  isEco:false, isBestseller:false, minOrder:1, color:'#78716c', tag:'Tool',      desc:'Heavy-duty manual eyelet puncher for installing rope handles.' },
  { id:'r6',  name:'Rope Handle — 300m Roll',         slug:'rope-handle-300m',        category:'raw_materials', basePrice:0, rating:4.8, reviews:89,  isEco:true,  isBestseller:true,  minOrder:1, color:'#c8a97e', tag:'Material',  desc:'Twisted paper rope handle. 300m per roll, natural kraft colour.' },
  { id:'r7',  name:'Water-Based Ink',                 slug:'water-based-ink',         category:'raw_materials', basePrice:0, rating:4.8, reviews:74,  isEco:true,  isBestseller:false, minOrder:1, color:'#22d3ee', tag:'Ink',       desc:'Eco-friendly water-based ink. Vibrant colour, quick-dry formula.' },
  { id:'r8',  name:'Plastisol Ink',                   slug:'plastisol-ink',           category:'raw_materials', basePrice:0, rating:4.7, reviews:67,  isEco:false, isBestseller:false, minOrder:1, color:'#f59e0b', tag:'Ink',       desc:'High-opacity plastisol ink for silkscreen printing on paper bags.' },
  { id:'r9',  name:'Aluminium Squeegee — 20cm',       slug:'squeegee-20cm',           category:'raw_materials', basePrice:0, rating:4.8, reviews:91,  isEco:false, isBestseller:false, minOrder:1, color:'#94a3b8', tag:'20cm',      desc:'20cm aluminium squeegee for small silkscreen frames.' },
  { id:'r10', name:'Aluminium Squeegee — 30cm',       slug:'squeegee-30cm',           category:'raw_materials', basePrice:0, rating:4.9, reviews:118, isEco:false, isBestseller:true,  minOrder:1, color:'#64748b', tag:'30cm',      desc:'30cm squeegee — most popular size for standard bag printing.' },
  { id:'r11', name:'Aluminium Squeegee — 45cm',       slug:'squeegee-45cm',           category:'raw_materials', basePrice:0, rating:4.8, reviews:76,  isEco:false, isBestseller:false, minOrder:1, color:'#475569', tag:'45cm',      desc:'45cm wide squeegee for large-format silkscreen frames.' },
  { id:'r12', name:'Light Box (Exposure Unit)',        slug:'light-box-exposure',      category:'raw_materials', basePrice:0, rating:4.9, reviews:51,  isEco:false, isBestseller:false, minOrder:1, color:'#fbbf24', tag:'Equipment', desc:'UV exposure unit for burning silkscreen stencils. Professional grade.' },
];

type ViewMode  = 'grid' | 'list';
type SortOpt   = 'featured' | 'price_asc' | 'price_desc' | 'rating';

/* ── Variant slide toggle ────────────────────────────────────── */
function VariantToggle({
  variants, active, onChange,
}: { variants: BagVariant[]; active: number; onChange: (i: number) => void }) {
  return (
    <div className="relative flex rounded-lg bg-white/[0.06] border border-white/[0.09] p-0.5 w-full">
      {/* sliding pill */}
      <motion.div
        className="absolute top-0.5 bottom-0.5 rounded-md bg-brand-600/80 border border-brand-500/50 shadow-sm"
        animate={{ left: active === 0 ? '2px' : '50%', width: 'calc(50% - 2px)' }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
      />
      {variants.map((v, i) => (
        <button
          key={v.label}
          onClick={() => onChange(i)}
          className={cn(
            'relative z-10 flex-1 text-xs font-semibold py-1.5 rounded-md transition-colors duration-200',
            active === i ? 'text-white' : 'text-dark-400 hover:text-dark-200',
          )}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

/* ── Grouped bag card ────────────────────────────────────────── */
function GroupedCard({ product, viewMode }: { product: GroupedProduct; viewMode: ViewMode }) {
  const [activeVariant, setActiveVariant] = useState(0);
  const v = product.variants[activeVariant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('card card-hover group', viewMode === 'list' && 'flex gap-5')}
    >
      {/* Image area */}
      <div className={cn(
        'relative rounded-t-2xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-700',
        viewMode === 'grid' ? 'h-44' : 'w-40 h-32 rounded-xl flex-shrink-0 rounded-b-2xl',
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-28 rounded-lg shadow-xl group-hover:scale-105 transition-transform duration-300"
            style={{
              background: `linear-gradient(135deg, ${product.color}50, ${product.color}20)`,
              border: `1px solid ${product.color}40`,
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-bold text-2xl opacity-40" style={{ color: product.color }}>CP</span>
            </div>
          </div>
        </div>
        {product.isBestseller && (
          <span className="absolute top-2 left-2 badge bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs">
            <Star className="w-2.5 h-2.5 fill-current" /> Best
          </span>
        )}
        {product.isEco && (
          <span className="absolute top-2 right-2 badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-xs">
            <Leaf className="w-2.5 h-2.5" /> Eco
          </span>
        )}
      </div>

      {/* Content */}
      <div className={cn('p-4 space-y-3', viewMode === 'list' && 'flex-1')}>
        <div>
          <p className="text-2xs text-dark-500 uppercase tracking-wider mb-1">
            {product.category === 'kraft_bags' ? 'Kraft Paper Bag' : 'White Duplex Bag'}
          </p>
          <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-dark-500 mt-1 line-clamp-1">{product.desc}</p>
        </div>

        {/* Variant slide toggle */}
        <VariantToggle variants={product.variants} active={activeVariant} onChange={setActiveVariant} />

        {/* Price + actions */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-2xs text-dark-500">per piece</div>
            <motion.div
              key={v.price}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="font-bold text-lg text-white"
            >
              ETB {v.price}
            </motion.div>
            <div className="text-2xs text-dark-500">min. {product.minOrder} pcs · discount &gt; 500</div>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary text-xs px-3 py-2">
              <ShoppingCart className="w-3 h-3" />
            </button>
            <Link href={`/products/${v.slug}`} className="btn-primary text-xs px-3 py-2">View</Link>
          </div>
        </div>

        <div className="flex items-center gap-1 pt-0.5 border-t border-white/5">
          <Star className="w-3 h-3 text-gold-400 fill-current" />
          <span className="text-xs font-medium text-white">{product.rating}</span>
          <span className="text-xs text-dark-500">({product.reviews} reviews)</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Single product card (boxes, raw materials) ──────────────── */
function SingleCard({ product, viewMode }: { product: SingleProduct; viewMode: ViewMode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('card card-hover group', viewMode === 'list' && 'flex gap-5')}
    >
      <div className={cn(
        'relative rounded-t-2xl overflow-hidden bg-gradient-to-br from-dark-800 to-dark-700',
        viewMode === 'grid' ? 'h-44' : 'w-40 h-32 rounded-xl flex-shrink-0 rounded-b-2xl',
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-xl shadow-xl group-hover:scale-105 transition-transform duration-300 flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${product.color}50, ${product.color}20)`, border: `1px solid ${product.color}40` }}
          >
            <Package className="w-8 h-8 opacity-50" style={{ color: product.color }} />
          </div>
        </div>
        {product.isBestseller && (
          <span className="absolute top-2 left-2 badge bg-gold-500/20 text-gold-300 border border-gold-500/30 text-xs">
            <Star className="w-2.5 h-2.5 fill-current" /> Best
          </span>
        )}
        <span className="absolute top-2 right-2 badge bg-white/5 text-dark-400 border border-white/8 text-xs">
          <Tag className="w-2.5 h-2.5" /> {product.tag}
        </span>
      </div>

      <div className={cn('p-4 space-y-3', viewMode === 'list' && 'flex-1')}>
        <div>
          <p className="text-2xs text-dark-500 uppercase tracking-wider mb-1">
            {product.category.replace(/_/g, ' ')}
          </p>
          <h3 className="font-semibold text-white text-sm group-hover:text-brand-300 transition-colors leading-snug">
            {product.name}
          </h3>
          <p className="text-xs text-dark-500 mt-1 line-clamp-2">{product.desc}</p>
        </div>

        <div className="flex items-end justify-between pt-1">
          <div>
            <div className="text-2xs text-dark-500">from</div>
            <div className="font-bold text-white">
              {product.basePrice > 0 ? `ETB ${product.basePrice}` : 'Contact for price'}
            </div>
            <div className="text-2xs text-dark-500">
              min. {product.minOrder} {product.minOrder === 1 ? 'unit' : 'pcs'}
              {product.minOrder >= 200 && ' · discount > 500'}
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/products/${product.slug}`} className="btn-primary text-xs px-3 py-2">View</Link>
          </div>
        </div>

        <div className="flex items-center gap-1 pt-0.5 border-t border-white/5">
          <Star className="w-3 h-3 text-gold-400 fill-current" />
          <span className="text-xs font-medium text-white">{product.rating}</span>
          <span className="text-xs text-dark-500">({product.reviews} reviews)</span>
          {product.isEco && (
            <span className="ml-auto text-xs flex items-center gap-1 text-emerald-400">
              <Leaf className="w-3 h-3" /> Eco
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main catalog ────────────────────────────────────────────── */
type DisplayItem = { type: 'grouped'; data: GroupedProduct } | { type: 'single'; data: SingleProduct };

export default function ProductCatalog() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery,    setSearchQuery]    = useState('');
  const [viewMode,       setViewMode]       = useState<ViewMode>('grid');
  const [sortBy,         setSortBy]         = useState<SortOpt>('featured');
  const [ecoOnly,        setEcoOnly]        = useState(false);

  const displayItems = useMemo((): DisplayItem[] => {
    const q = searchQuery.toLowerCase().trim();

    const grouped: DisplayItem[] = GROUPED
      .filter(p => activeCategory === 'all' || p.category === activeCategory)
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .filter(p => !ecoOnly || p.isEco)
      .map(p => ({ type: 'grouped' as const, data: p }));

    const singles: DisplayItem[] = SINGLES
      .filter(p => activeCategory === 'all' || p.category === activeCategory)
      .filter(p => !q || p.name.toLowerCase().includes(q))
      .filter(p => !ecoOnly || p.isEco)
      .map(p => ({ type: 'single' as const, data: p }));

    const all = [...grouped, ...singles];

    if (sortBy === 'rating') {
      return all.sort((a, b) => {
        const ra = a.type === 'grouped' ? a.data.rating : a.data.rating;
        const rb = b.type === 'grouped' ? b.data.rating : b.data.rating;
        return rb - ra;
      });
    }
    if (sortBy === 'price_asc' || sortBy === 'price_desc') {
      return all.sort((a, b) => {
        const pa = a.type === 'grouped' ? a.data.variants[0].price : (a.data as SingleProduct).basePrice;
        const pb = b.type === 'grouped' ? b.data.variants[0].price : (b.data as SingleProduct).basePrice;
        return sortBy === 'price_asc' ? pa - pb : pb - pa;
      });
    }
    return all;
  }, [activeCategory, searchQuery, sortBy, ecoOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-2 text-brand-400 text-sm font-semibold uppercase tracking-wider mb-3">
          <div className="w-8 h-px bg-brand-400" /> Product Catalog
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-white mb-3">
          Premium Packaging <span className="gradient-text">Solutions</span>
        </h1>
        <p className="text-dark-300 text-lg max-w-2xl">
          Kraft bags, white duplex bags, cake boxes and silkscreen printing supplies.
          Custom branding on all bag products — minimum 200 pcs, discount above 500.
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block flex-shrink-0 w-56 space-y-6">
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
                      : 'text-dark-400 hover:text-white hover:bg-white/5',
                  )}
                >
                  <span>{cat.label}</span>
                  <span className={cn('text-xs', activeCategory === cat.id ? 'text-brand-400' : 'text-dark-600')}>{cat.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Sustainability</h3>
            <label className="flex items-center gap-2 cursor-pointer group">
              <div
                onClick={() => setEcoOnly(!ecoOnly)}
                className={cn('w-10 h-5 rounded-full transition-colors duration-200 relative cursor-pointer', ecoOnly ? 'bg-emerald-600' : 'bg-dark-700')}
              >
                <div className={cn('absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200', ecoOnly ? 'translate-x-5' : 'translate-x-0.5')} />
              </div>
              <span className="text-sm text-dark-300 group-hover:text-white transition-colors flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Eco-Friendly Only
              </span>
            </label>
          </div>

          <button
            onClick={() => { setActiveCategory('all'); setEcoOnly(false); setSearchQuery(''); }}
            className="text-xs text-dark-500 hover:text-white transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Reset Filters
          </button>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text" placeholder="Search products..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-9 py-2.5 text-sm"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-3.5 h-3.5 text-dark-400 hover:text-white" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={sortBy} onChange={e => setSortBy(e.target.value as SortOpt)}
                className="input-field pr-8 py-2.5 text-sm appearance-none cursor-pointer min-w-36"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="rating">Best Rated</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
            </div>

            <div className="flex gap-1 p-1 rounded-xl bg-dark-800 border border-white/5">
              {(['grid', 'list'] as ViewMode[]).map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={cn('p-2 rounded-lg transition-colors', viewMode === m ? 'bg-dark-600 text-white' : 'text-dark-400 hover:text-white')}
                >
                  {m === 'grid' ? <Grid3X3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <span className="text-sm text-dark-400 ml-auto">{displayItems.length} products</span>
          </div>

          {/* Mobile category pills */}
          <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                  activeCategory === cat.id ? 'bg-brand-600 text-white' : 'bg-dark-800 text-dark-400 hover:text-white',
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Variant slide hint (shown only for bag categories) */}
          {(activeCategory === 'all' || activeCategory === 'kraft_bags' || activeCategory === 'duplex_bags') && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500/8 border border-brand-500/20 text-xs text-brand-300"
            >
              <div className="w-4 h-4 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-300 text-xs font-bold">↔</span>
              </div>
              Slide the toggle on each bag card to switch between <strong className="text-brand-200">With Logo</strong> and <strong className="text-brand-200">Plain</strong> pricing.
            </motion.div>
          )}

          {/* Product grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery + sortBy}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className={cn('grid gap-5', viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}
            >
              {displayItems.map((item, i) =>
                item.type === 'grouped'
                  ? <GroupedCard key={item.data.id} product={item.data} viewMode={viewMode} />
                  : <SingleCard  key={item.data.id} product={item.data} viewMode={viewMode} />
              )}
            </motion.div>
          </AnimatePresence>

          {displayItems.length === 0 && (
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
