'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit3, Trash2, X, Save, Package, Star,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   Types
────────────────────────────────────────────────────────────── */
interface Product {
  id:          string;
  name:        string;
  category:    string;
  price:       number;
  minOrder:    number;
  description: string;
  features:    string;
  inStock:     boolean;
  featured:    boolean;
  imageUrl:    string;
  createdAt:   string;
}

const CATEGORIES = [
  { value: 'kraft_bags',     label: 'Kraft Paper Bags' },
  { value: 'duplex_bags',    label: 'White Duplex Bags' },
  { value: 'cake_boxes',     label: 'Cake & Cookies Boxes' },
  { value: 'raw_materials',  label: 'Raw Materials' },
];

const catLabel = (v: string) => CATEGORIES.find(c => c.value === v)?.label ?? v;

const SEED: Product[] = [
  /* ── KRAFT PAPER BAGS ── */
  { id:'p01', name:'Kraft Paper Bag — Small (with Logo)',       category:'kraft_bags',    price:39,  minOrder:200, description:'Small kraft paper bag with custom logo print. Great for cafes and boutique shops.',      features:'Kraft paper, twisted rope handle, 1-colour logo, food-safe',   inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p02', name:'Kraft Paper Bag — Medium (with Logo)',      category:'kraft_bags',    price:45,  minOrder:200, description:'Medium kraft bag with logo. Ideal for retail, bakeries, and gift shops.',              features:'Kraft paper, twisted rope handle, 1-colour logo, eco-friendly', inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p03', name:'Kraft Paper Bag — Large (with Logo)',       category:'kraft_bags',    price:53,  minOrder:200, description:'Large kraft bag with logo. Perfect for supermarkets and large retail orders.',          features:'Kraft paper, flat/rope handle, 1-colour logo, bulk pricing',   inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p04', name:'Kraft Paper Bag — Extra Large (with Logo)', category:'kraft_bags',    price:60,  minOrder:200, description:'Extra-large kraft bag with custom logo for wholesalers and corporate gifting.',        features:'Kraft paper, rope handle, 1-colour logo, reinforced base',     inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p05', name:'Kraft Paper Bag — Small (Plain)',           category:'kraft_bags',    price:29,  minOrder:200, description:'Small plain kraft paper bag, no branding. Budget-friendly option for any business.',   features:'Kraft paper, twisted rope handle, unprinted, eco-friendly',    inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p06', name:'Kraft Paper Bag — Medium (Plain)',          category:'kraft_bags',    price:32,  minOrder:200, description:'Medium plain kraft bag. Blank canvas for in-store branding or stickering.',           features:'Kraft paper, rope handle, unprinted, bulk available',          inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p07', name:'Kraft Paper Bag — Large (Plain)',           category:'kraft_bags',    price:37,  minOrder:200, description:'Large plain kraft bag for groceries, garments, and heavy retail use.',                features:'Kraft paper, flat handle, unprinted, load-bearing',            inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p08', name:'Kraft Paper Bag — Extra Large (Plain)',     category:'kraft_bags',    price:47,  minOrder:200, description:'Extra-large plain kraft bag for bulk wholesale and distribution.',                    features:'Kraft paper, rope handle, unprinted, reinforced gusset',       inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },

  /* ── WHITE DUPLEX PAPER BAGS ── */
  { id:'p09', name:'White Duplex Bag — Small (with Logo)',       category:'duplex_bags',  price:43,  minOrder:200, description:'Small premium white duplex bag with full-colour logo. Premium look for boutiques.',    features:'White duplex, twisted handle, full-colour print, glossy',      inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p10', name:'White Duplex Bag — Medium (with Logo)',      category:'duplex_bags',  price:53,  minOrder:200, description:'Medium white duplex with logo print. A premium choice for fashion & gift brands.',    features:'White duplex, rope handle, full-colour print, clean finish',   inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p11', name:'White Duplex Bag — Large (with Logo)',       category:'duplex_bags',  price:60,  minOrder:200, description:'Large white duplex bag with logo. Excellent for upscale retail and hotel gifts.',      features:'White duplex, flat handle, full-colour print, premium finish',  inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p12', name:'White Duplex Bag — Extra Large (with Logo)', category:'duplex_bags',  price:75,  minOrder:200, description:'Extra-large premium duplex bag for luxury brands and corporate events.',               features:'White duplex, rope handle, full-colour print, heavy-duty',     inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p13', name:'White Duplex Bag — Small (Plain)',           category:'duplex_bags',  price:33,  minOrder:200, description:'Small plain white duplex paper bag. Clean and professional unbranded option.',         features:'White duplex, twisted handle, unprinted, crisp white finish',  inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p14', name:'White Duplex Bag — Medium (Plain)',          category:'duplex_bags',  price:43,  minOrder:200, description:'Medium plain white duplex bag. Great for sticker branding in-store.',                 features:'White duplex, rope handle, unprinted, bulk available',         inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p15', name:'White Duplex Bag — Large (Plain)',           category:'duplex_bags',  price:53,  minOrder:200, description:'Large plain white duplex for premium retailers who apply their own branding.',         features:'White duplex, flat handle, unprinted, premium weight',         inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p16', name:'White Duplex Bag — Extra Large (Plain)',     category:'duplex_bags',  price:65,  minOrder:200, description:'Extra-large plain duplex bag for wholesale and distribution.',                        features:'White duplex, rope handle, unprinted, reinforced',             inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },

  /* ── CAKE & COOKIES BOXES ── */
  { id:'p17', name:'1kg Cake Box — with Logo',                         category:'cake_boxes',   price:60,  minOrder:200, description:'1kg rigid cake box with custom logo print. Ideal for bakeries and patisseries.',      features:'Rigid board, logo print, secure lock, white finish',           inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p18', name:'1kg Cake Box — Transparent Window + Logo',         category:'cake_boxes',   price:70,  minOrder:200, description:'1kg cake box with PVC window and logo. Perfect for display and premium gifting.',     features:'Rigid board, PVC window, logo print, display-ready',           inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p19', name:'2kg Cake Box — with Logo',                         category:'cake_boxes',   price:80,  minOrder:200, description:'Large 2kg cake box with logo. Suited for wedding cakes and catering orders.',         features:'Rigid board, logo print, large format, heavy-duty',            inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p20', name:'2kg Cookies Box — Transparent Window + Logo',      category:'cake_boxes',   price:90,  minOrder:200, description:'2kg cookies box with transparent window and logo. Showroom-ready packaging.',          features:'Rigid board, PVC window, logo print, large format',            inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p21', name:'1kg Cookies Box — with Logo',                      category:'cake_boxes',   price:55,  minOrder:200, description:'Standard 1kg cookies box with logo branding. Popular for bakeries and sweet shops.',  features:'Rigid board, logo print, secure tuck-top',                    inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p22', name:'1kg Cookies Box — Transparent Window + Logo',      category:'cake_boxes',   price:65,  minOrder:200, description:'1kg cookies box with PVC window and logo. Best for display sales.',                   features:'Rigid board, PVC window, logo print, window display',          inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p23', name:'½kg Cake Box — with Logo',                         category:'cake_boxes',   price:45,  minOrder:200, description:'Half-kilo cake box with logo. Perfect for individual slices and mini cakes.',         features:'Rigid board, logo print, compact size, bakery-ready',          inStock:true,  featured:true,  imageUrl:'', createdAt:'2026-01-01' },
  { id:'p24', name:'½kg Cookies Box — Transparent Window + Logo',      category:'cake_boxes',   price:50,  minOrder:200, description:'Half-kilo cookies box with window and logo. Ideal for gifting individual treats.',     features:'Rigid board, PVC window, logo print, gift-ready',              inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p25', name:'½kg Cookies Box — with Logo',                      category:'cake_boxes',   price:60,  minOrder:200, description:'Half-kilo cookies box with logo. Great for take-away cookie and pastry packaging.',   features:'Rigid board, logo print, compact, tuck-top closure',           inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },

  /* ── RAW MATERIALS ── */
  { id:'p26', name:'Silkscreen Frame',                   category:'raw_materials', price:0,   minOrder:1,   description:'Professional silkscreen frame for custom bag and box printing. Various mesh sizes available.', features:'Aluminium frame, various mesh counts, durable', inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p27', name:'Silkscreen Printer — 1 Handle',     category:'raw_materials', price:0,   minOrder:1,   description:'Single-handle silkscreen printing press for small-scale logo printing on paper bags.',           features:'1-handle, manual press, desktop size, portable',inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p28', name:'Silkscreen Printer — 2 Handle',     category:'raw_materials', price:0,   minOrder:1,   description:'Two-handle silkscreen press for improved stability and consistent print quality.',               features:'2-handle, manual press, stable base',           inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p29', name:'Silkscreen Printer — 4 Handle',     category:'raw_materials', price:0,   minOrder:1,   description:'Four-handle professional silkscreen press for high-volume logo printing operations.',            features:'4-handle, industrial, high-volume, precision',  inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p30', name:'Eyelet Puncher',                    category:'raw_materials', price:0,   minOrder:1,   description:'Heavy-duty eyelet puncher for installing rope handles on kraft and duplex paper bags.',          features:'Heavy-duty, manual, various eyelet sizes',      inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p31', name:'Rope Handle — 300m Roll',           category:'raw_materials', price:0,   minOrder:1,   description:'300m roll of twisted paper rope for bag handles. Natural kraft colour. Sold per roll.',          features:'Twisted paper, 300m/roll, kraft colour, strong',inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p32', name:'Water-Based Ink',                   category:'raw_materials', price:0,   minOrder:1,   description:'Eco-friendly water-based ink for silkscreen printing. Vibrant colour, quick-dry formula.',      features:'Water-based, eco-friendly, quick-dry, vivid',   inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p33', name:'Plastisol Ink',                     category:'raw_materials', price:0,   minOrder:1,   description:'Plastisol ink for silkscreen printing. High opacity, excellent on kraft and duplex paper.',      features:'Plastisol, high-opacity, durable, heat-cured',  inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p34', name:'Aluminium Squeegee — 20cm',         category:'raw_materials', price:0,   minOrder:1,   description:'20cm aluminium squeegee for silkscreen ink application. Suitable for small frames.',             features:'Aluminium handle, 20cm blade, polyurethane',    inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p35', name:'Aluminium Squeegee — 30cm',         category:'raw_materials', price:0,   minOrder:1,   description:'30cm aluminium squeegee. The most popular size for standard bag printing.',                     features:'Aluminium handle, 30cm blade, polyurethane',    inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p36', name:'Aluminium Squeegee — 45cm',         category:'raw_materials', price:0,   minOrder:1,   description:'45cm wide aluminium squeegee for large-format silkscreen printing frames.',                     features:'Aluminium handle, 45cm blade, polyurethane',    inStock:true,  featured:false, imageUrl:'', createdAt:'2026-01-01' },
  { id:'p37', name:'Light Box (Exposure Unit)',         category:'raw_materials', price:0,   minOrder:1,   description:'UV exposure light box for burning silkscreen stencils. Professional-grade, consistent exposure.', features:'UV lamp, timer, professional grade, various sizes',inStock:true, featured:false, imageUrl:'', createdAt:'2026-01-01' },
];

/* ──────────────────────────────────────────────────────────────
   Product Form Modal
────────────────────────────────────────────────────────────── */
const EMPTY_FORM = { name:'', category:'kraft_bags', price:39, minOrder:200, description:'', features:'', inStock:true, featured:false, imageUrl:'' };

function ProductModal({ initial, onSave, onClose }: {
  initial: Product | null;
  onSave:  (p: Omit<Product, 'id'|'createdAt'>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(
    initial ? { name:initial.name, category:initial.category, price:initial.price, minOrder:initial.minOrder,
                description:initial.description, features:initial.features, inStock:initial.inStock,
                featured:initial.featured, imageUrl:initial.imageUrl }
            : { ...EMPTY_FORM }
  );
  const [err, setErr] = useState('');

  const f = (k: string, v: unknown) => { setForm(p => ({ ...p, [k]: v })); setErr(''); };

  function submit() {
    if (!form.name.trim())  { setErr('Product name is required.'); return; }
    if (form.price <= 0)    { setErr('Price must be greater than 0.'); return; }
    if (form.minOrder <= 0) { setErr('Minimum order must be greater than 0.'); return; }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto card bg-dark-900 border-white/10 p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white">
            {initial ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="btn-ghost p-2"><X className="w-4 h-4" /></button>
        </div>

        {err && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{err}</div>}

        <div className="grid md:grid-cols-2 gap-4">
          <div className="md:col-span-2 space-y-1">
            <label className="label">Product Name *</label>
            <input value={form.name} onChange={e => f('name', e.target.value)}
              placeholder="e.g. Kraft Paper Bag – Small" className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Category</label>
            <select value={form.category} onChange={e => f('category', e.target.value)} className="select-field">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="label">Base Price (ETB / unit)</label>
            <input type="number" value={form.price} min={1}
              onChange={e => f('price', Number(e.target.value))} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Minimum Order (units)</label>
            <input type="number" value={form.minOrder} min={1}
              onChange={e => f('minOrder', Number(e.target.value))} className="input-field" />
          </div>
          <div className="space-y-1">
            <label className="label">Image URL (optional)</label>
            <input value={form.imageUrl} onChange={e => f('imageUrl', e.target.value)}
              placeholder="https://..." className="input-field" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="label">Description</label>
            <textarea rows={3} value={form.description} onChange={e => f('description', e.target.value)}
              placeholder="Short product description..." className="input-field resize-none" />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="label">Features (comma-separated)</label>
            <input value={form.features} onChange={e => f('features', e.target.value)}
              placeholder="e.g. Kraft paper, twisted handle, custom print" className="input-field" />
          </div>
        </div>

        <div className="flex gap-6">
          {([
            { key: 'inStock', label: 'In Stock', on: 'bg-brand-600' },
            { key: 'featured', label: 'Featured', on: 'bg-gold-500' },
          ] as const).map(({ key, label, on }) => (
            <button key={key} onClick={() => f(key, !(form as Record<string, unknown>)[key])}
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${(form as Record<string, unknown>)[key] ? (key === 'featured' ? 'text-gold-400' : 'text-brand-400') : 'text-dark-400'}`}>
              <div className={`w-10 h-5 rounded-full transition-colors ${(form as Record<string, unknown>)[key] ? on : 'bg-white/10'} relative`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${(form as Record<string, unknown>)[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              {label}
            </button>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <button onClick={submit} className="btn-primary flex-1">
            <Save className="w-4 h-4" /> {initial ? 'Save Changes' : 'Add Product'}
          </button>
          <button onClick={onClose} className="btn-secondary">Cancel</button>
        </div>
      </motion.div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   Admin Products Section
────────────────────────────────────────────────────────────── */
export default function AdminProductsSection() {
  const [products,   setProducts]   = useState<Product[]>(SEED);
  const [modal,      setModal]      = useState<'add' | Product | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const [search,     setSearch]     = useState('');
  const [filterCat,  setFilterCat]  = useState('all');

  const filtered = useMemo(() => products
    .filter(p => filterCat === 'all' || p.category === filterCat)
    .filter(p => !search.trim() || p.name.toLowerCase().includes(search.toLowerCase()))
  , [products, filterCat, search]);

  function handleSave(data: Omit<Product, 'id'|'createdAt'>) {
    if (modal === 'add') {
      setProducts(prev => [...prev, { ...data, id:`p${Date.now()}`, createdAt: new Date().toISOString().slice(0,10) }]);
    } else if (modal && typeof modal === 'object') {
      setProducts(prev => prev.map(p => p.id === modal.id ? { ...p, ...data } : p));
    }
    setModal(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Package className="w-6 h-6 text-brand-400" /> Products
          </h1>
          <p className="page-description">{products.length} products in catalogue</p>
        </div>
        <button onClick={() => setModal('add')} className="btn-primary">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search products…" className="input-field pl-9" />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="select-field sm:w-52">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-white/5">
              <th className="table-header text-left px-5 py-3">Product</th>
              <th className="table-header text-left px-5 py-3">Category</th>
              <th className="table-header text-right px-5 py-3">Price (ETB)</th>
              <th className="table-header text-right px-5 py-3">Min. Order</th>
              <th className="table-header text-center px-5 py-3">Stock</th>
              <th className="table-header text-center px-5 py-3">Featured</th>
              <th className="table-header px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
              {filtered.map(p => (
                <motion.tr key={p.id} layout initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="hover:bg-white/3 transition-colors">
                  <td className="table-cell px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-900/40 border border-brand-800/30 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-brand-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{p.name}</div>
                        <div className="text-xs text-dark-500 mt-0.5 max-w-[200px] truncate">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell px-5">
                    <span className="badge-brand">{catLabel(p.category)}</span>
                  </td>
                  <td className="table-cell px-5 text-right font-medium text-white">{p.price.toLocaleString()}</td>
                  <td className="table-cell px-5 text-right text-dark-300">{p.minOrder.toLocaleString()} pcs</td>
                  <td className="table-cell px-5 text-center">
                    <button onClick={() => setProducts(prev => prev.map(x => x.id===p.id ? {...x,inStock:!x.inStock} : x))}>
                      {p.inStock ? <span className="badge-success">In Stock</span> : <span className="badge-danger">Out</span>}
                    </button>
                  </td>
                  <td className="table-cell px-5 text-center">
                    <button onClick={() => setProducts(prev => prev.map(x => x.id===p.id ? {...x,featured:!x.featured} : x))}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition-colors ${p.featured ? 'bg-gold-500/20 text-gold-400' : 'bg-white/5 text-dark-500 hover:text-dark-300'}`}>
                      <Star className="w-4 h-4" fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                  </td>
                  <td className="table-cell px-5">
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setModal(p)} className="btn-ghost p-2"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setConfirmDel(p.id)} className="btn-ghost p-2 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-dark-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No products match your filters.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modal !== null && (
          <ProductModal initial={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {confirmDel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
            <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.95 }}
              className="card bg-dark-900 border-white/10 p-6 max-w-sm w-full space-y-4">
              <h3 className="font-bold text-white font-display">Delete Product?</h3>
              <p className="text-dark-300 text-sm">This will permanently remove the product from the catalogue.</p>
              <div className="flex gap-3">
                <button className="btn-danger flex-1"
                  onClick={() => { setProducts(p => p.filter(x => x.id !== confirmDel)); setConfirmDel(null); }}>Delete</button>
                <button className="btn-secondary" onClick={() => setConfirmDel(null)}>Cancel</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
