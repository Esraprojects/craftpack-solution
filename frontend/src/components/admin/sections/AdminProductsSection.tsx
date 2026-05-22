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
  { value: 'paper_bags',     label: 'Paper Bags' },
  { value: 'shopping_bags',  label: 'Shopping Bags' },
  { value: 'luxury_bags',    label: 'Luxury Packaging' },
  { value: 'food_packaging', label: 'Food Packaging' },
  { value: 'eco_friendly',   label: 'Eco-Friendly' },
  { value: 'custom_printed', label: 'Custom Printed' },
];

const catLabel = (v: string) => CATEGORIES.find(c => c.value === v)?.label ?? v;

const SEED: Product[] = [
  { id:'p1', name:'Kraft Paper Bag – Small',   category:'paper_bags',     price:8,    minOrder:500,  description:'Eco-friendly kraft paper bag with twisted handles.',       features:'Kraft paper, twisted handle, custom print', inStock:true,  featured:true,  imageUrl:'', createdAt:'2025-01-10' },
  { id:'p2', name:'Kraft Paper Bag – Large',   category:'paper_bags',     price:14,   minOrder:300,  description:'Large-format kraft bag for grocery, bakery and fashion.',   features:'300gsm kraft, flat handle, CMYK print',     inStock:true,  featured:false, imageUrl:'', createdAt:'2025-01-10' },
  { id:'p3', name:'Luxury Ribbon Bag',         category:'luxury_bags',    price:35,   minOrder:100,  description:'Premium matte-laminated bag with satin ribbon handles.',     features:'Matte lamination, satin ribbon, spot-UV',    inStock:true,  featured:true,  imageUrl:'', createdAt:'2025-02-05' },
  { id:'p4', name:'Food Kraft Bag',            category:'food_packaging', price:6,    minOrder:1000, description:'Greaseproof kraft bag for bakery and snack packaging.',       features:'Greaseproof liner, FDA-safe ink',            inStock:true,  featured:false, imageUrl:'', createdAt:'2025-02-18' },
  { id:'p5', name:'Eco Jute-Style Bag',        category:'eco_friendly',   price:22,   minOrder:200,  description:'Jute-texture paper bag with 100% recycled content.',          features:'Recycled content, soy ink, FSC certified',  inStock:true,  featured:true,  imageUrl:'', createdAt:'2025-03-01' },
  { id:'p6', name:'Custom Printed Tote',       category:'custom_printed', price:18,   minOrder:250,  description:'Full-bleed printed paper tote with PMS ink matching.',        features:'Full bleed, PMS matching, emboss option',   inStock:true,  featured:true,  imageUrl:'', createdAt:'2025-03-15' },
  { id:'p7', name:'Shopping Bag – Medium',     category:'shopping_bags',  price:11,   minOrder:400,  description:'Mid-size coated paper shopping bag for fashion brands.',      features:'Coated paper, flat handle, foil stamp',     inStock:true,  featured:false, imageUrl:'', createdAt:'2025-04-02' },
  { id:'p8', name:'Cake & Pastry Box',         category:'food_packaging', price:20,   minOrder:200,  description:'Rigid cake box with PVC window for patisseries.',             features:'Rigid board, PVC window, white or kraft',   inStock:false, featured:false, imageUrl:'', createdAt:'2025-04-20' },
];

/* ──────────────────────────────────────────────────────────────
   Product Form Modal
────────────────────────────────────────────────────────────── */
const EMPTY_FORM = { name:'', category:'paper_bags', price:10, minOrder:500, description:'', features:'', inStock:true, featured:false, imageUrl:'' };

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
